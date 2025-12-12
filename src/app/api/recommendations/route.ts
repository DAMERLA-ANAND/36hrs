import { NextResponse } from 'next/server';
import { getJobRecommendations } from '@/services/python.service';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { skills, experience, location } = body;

    if (!skills || !experience) {
      return NextResponse.json(
        { error: 'Skills and experience are required' },
        { status: 400 }
      );
    }

    const recommendations = await getJobRecommendations({
      skills,
      experience,
      location,
    });

    return NextResponse.json(recommendations);
  } catch (error) {
    console.error('Error in recommendations API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch recommendations' },
      { status: 500 }
    );
  }
}
