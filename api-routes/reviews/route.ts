import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'userId query parameter is required' }, { status: 400 });
    }

    const reviews = await db.review.findMany({
      where: { revieweeId: userId },
      include: {
        reviewer: {
          select: { id: true, name: true, username: true, image: true },
        },
        session: {
          select: { id: true, skillName: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ reviews });
  } catch (error: any) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json({ error: 'Failed to fetch reviews', details: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId, reviewerId, revieweeId, rating, comment } = body;

    if (!sessionId || !reviewerId || !revieweeId || !rating) {
      return NextResponse.json(
        { error: 'sessionId, reviewerId, revieweeId, and rating are required' },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Rating must be between 1 and 5' }, { status: 400 });
    }

    if (reviewerId === revieweeId) {
      return NextResponse.json({ error: 'Cannot review yourself' }, { status: 400 });
    }

    // Check if session exists
    const session = await db.session.findUnique({
      where: { id: sessionId },
    });

    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    // Check for existing review
    const existingReview = await db.review.findFirst({
      where: { sessionId, reviewerId },
    });

    if (existingReview) {
      return NextResponse.json({ error: 'You have already reviewed this session' }, { status: 400 });
    }

    const review = await db.$transaction(async (tx) => {
      // Create the review
      const newReview = await tx.review.create({
        data: {
          sessionId,
          reviewerId,
          revieweeId,
          rating,
          comment: comment || null,
        },
        include: {
          reviewer: {
            select: { id: true, name: true, username: true, image: true },
          },
          session: {
            select: { id: true, skillName: true },
          },
        },
      });

      // Recalculate average rating for the reviewee
      const allReviews = await tx.review.findMany({
        where: { revieweeId },
        select: { rating: true },
      });

      const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

      await tx.user.update({
        where: { id: revieweeId },
        data: { averageRating: Math.round(avgRating * 100) / 100 },
      });

      // Update session rated flags
      if (session.coachId === reviewerId) {
        await tx.session.update({
          where: { id: sessionId },
          data: { coachRated: true },
        });
      } else if (session.learnerId === reviewerId) {
        await tx.session.update({
          where: { id: sessionId },
          data: { learnerRated: true },
        });
      }

      return newReview;
    });

    return NextResponse.json({ review }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating review:', error);
    return NextResponse.json({ error: 'Failed to create review', details: error.message }, { status: 500 });
  }
}
