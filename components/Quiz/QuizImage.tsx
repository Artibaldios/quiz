'use client';
import { Image } from '@imagekit/next';

export default function QuizImage({ question }: { question: { image?: string } }) {
  return question.image ? (
    <Image
      src={question.image}
      alt="Question"
      fill
      className="object-cover object-center"
      transformation={[
        { width: "100%", height: "100%" }
      ]}
    />
  ) : null;
}