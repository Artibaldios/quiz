import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { nanoid } from 'nanoid';

export async function POST(req: NextRequest) {
  try {
    const { quizId } = await req.json();
    
    // Validate required fields
    if (!quizId) {
      return NextResponse.json(
        { error: 'quizId is required' },
        { status: 400 }
      );
    }

    // Generate unique 4-char code
    let code: string;
    let existingLobby;
    
    // Ensure unique code
    do {
      code = nanoid(4).toUpperCase();
      existingLobby = await prisma.lobby.findUnique({ where: { code } });
    } while (existingLobby);

    const lobby = await prisma.lobby.create({
      data: { 
        code, 
        quizId
      }
    });

    return NextResponse.json(lobby);
  } catch (error) {
    console.error('Error creating lobby:', error);
    return NextResponse.json(
      { error: 'Failed to create lobby' },
      { status: 500 }
    );
  }
}