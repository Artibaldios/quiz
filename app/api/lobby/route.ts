import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { code } = await req.json();

    // Validate required fields
    if (!code || code.trim().length !== 6) {
      return NextResponse.json(
        { error: 'Valid 6-character lobby code is required' },
        { status: 400 }
      );
    }

    const cleanCode = code.trim().toUpperCase();
    
    // Search for lobby by code
    const lobby = await prisma.lobby.findUnique({
      where: { code: cleanCode }
    });

    if (lobby) {
      return NextResponse.json({
        message: 'Lobby exists',
        status: 'ok',
        lobby: {
          code: lobby.code,
          quizId: lobby.quizId,
        }
      });
    } 

    return NextResponse.json({
      message: 'Lobby does not exist',
      status: 'not_found'
    }, { status: 404 });

  } catch (error) {
    console.error('Error searching lobby:', error);
    return NextResponse.json(
      { error: 'Failed to search lobby' },
      { status: 500 }
    );
  }
}