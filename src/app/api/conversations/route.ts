import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'userId query parameter is required' }, { status: 400 });
    }

    // Get conversations where the user is a participant
    const participants = await db.conversationParticipant.findMany({
      where: { userId },
      include: {
        conversation: {
          include: {
            messages: {
              orderBy: { createdAt: 'desc' },
              take: 1,
              include: {
                sender: {
                  select: { id: true, name: true, username: true, image: true },
                },
              },
            },
            participants: {
              include: {
                user: {
                  select: { id: true, name: true, username: true, image: true },
                },
              },
            },
          },
        },
      },
    });

    const conversations = participants.map((p) => {
      const conv = p.conversation;
      const lastMessage = conv.messages[0] || null;
      const otherParticipant = conv.participants.find(
        (cp: any) => cp.userId !== userId
      );
      const unreadCount = lastMessage && !lastMessage.isRead && lastMessage.senderId !== userId ? 1 : 0;

      return {
        id: conv.id,
        lastMessage,
        otherParticipant: otherParticipant?.user || null,
        unreadCount,
        lastReadAt: p.lastReadAt,
        updatedAt: conv.updatedAt,
        createdAt: conv.createdAt,
      };
    });

    // Sort by most recent message / updated time
    conversations.sort((a: any, b: any) => {
      const aTime = a.lastMessage?.createdAt || a.updatedAt;
      const bTime = b.lastMessage?.createdAt || b.updatedAt;
      return new Date(bTime).getTime() - new Date(aTime).getTime();
    });

    return NextResponse.json({ conversations });
  } catch (error: any) {
    console.error('Error fetching conversations:', error);
    return NextResponse.json({ error: 'Failed to fetch conversations', details: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId1, userId2 } = body;

    if (!userId1 || !userId2) {
      return NextResponse.json({ error: 'userId1 and userId2 are required' }, { status: 400 });
    }

    if (userId1 === userId2) {
      return NextResponse.json({ error: 'Users must be different' }, { status: 400 });
    }

    // Check if a conversation already exists between these two users
    const existingParticipants1 = await db.conversationParticipant.findMany({
      where: { userId: userId1 },
      select: { conversationId: true },
    });

    const conversationIds = existingParticipants1.map((p: any) => p.conversationId);

    if (conversationIds.length > 0) {
      const existingParticipant2 = await db.conversationParticipant.findFirst({
        where: {
          userId: userId2,
          conversationId: { in: conversationIds },
        },
      });

      if (existingParticipant2) {
        const conversation = await db.conversation.findUnique({
          where: { id: existingParticipant2.conversationId },
          include: {
            participants: {
              include: {
                user: {
                  select: { id: true, name: true, username: true, image: true },
                },
              },
            },
            messages: {
              orderBy: { createdAt: 'desc' },
              take: 1,
              include: {
                sender: {
                  select: { id: true, name: true, username: true, image: true },
                },
              },
            },
          },
        });

        return NextResponse.json({ conversation });
      }
    }

    // Create new conversation with both participants
    const conversation = await db.conversation.create({
      data: {
        participants: {
          create: [
            { userId: userId1 },
            { userId: userId2 },
          ],
        },
      },
      include: {
        participants: {
          include: {
            user: {
              select: { id: true, name: true, username: true, image: true },
            },
          },
        },
        messages: true,
      },
    });

    return NextResponse.json({ conversation }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating conversation:', error);
    return NextResponse.json({ error: 'Failed to create conversation', details: error.message }, { status: 500 });
  }
}
