import type { Answer } from "../../Question/type/QuestionType";
import { ScoringService } from "../../services/ScoringService";
import { generateNumericId } from "../../utils/helpers";

describe("ScoringService Tests", () => {
  describe("calculateQuestionPoints", () => {
    it("should calculate points correctly for a question with all correct answers", () => {
      const answer: Answer = {
        question: {
          id: "1",
          text: "Which of the following are prime numbers?",
          options: [
            { id: generateNumericId(), text: "2", correct: true },
            { id: generateNumericId(), text: "3", correct: true },
            { id: generateNumericId(), text: "4", correct: false },
            { id: generateNumericId(), text: "5", correct: true },
          ],
          difficulty: "easy",
          categories: ["math"],
        },
        userAnswers: [
          {
            option: { id: generateNumericId(), text: "2", correct: true },
            isSelected: true,
          },
          {
            option: { id: generateNumericId(), text: "3", correct: true },
            isSelected: true,
          },
          {
            option: { id: generateNumericId(), text: "4", correct: false },
            isSelected: true,
          },
          {
            option: { id: generateNumericId(), text: "5", correct: true },
            isSelected: true,
          },
        ],
        achievedPoints: 0,
      };

      const result = ScoringService.calculateQuestionPoints(answer);
      expect(result).toBe(2);
    });

    it("should calculate points correctly for partially correct answers", () => {
      const answer: Answer = {
        question: {
          id: "2",
          text: "Which of the following are even numbers?",
          options: [
            { id: generateNumericId(), text: "1", correct: false },
            { id: generateNumericId(), text: "2", correct: true },
            { id: generateNumericId(), text: "3", correct: false },
            { id: generateNumericId(), text: "4", correct: true },
          ],
          difficulty: "easy",
          categories: ["math"],
        },
        userAnswers: [
          {
            option: { id: generateNumericId(), text: "1", correct: false },
            isSelected: false,
          },
          {
            option: { id: generateNumericId(), text: "2", correct: true },
            isSelected: false,
          },
          {
            option: { id: generateNumericId(), text: "3", correct: false },
            isSelected: true,
          },
          {
            option: { id: generateNumericId(), text: "4", correct: true },
            isSelected: true,
          },
        ],
        achievedPoints: 0,
      };

      const result = ScoringService.calculateQuestionPoints(answer);
      expect(result).toBe(0);
    });
  });

  describe("calculateTotalPoints", () => {
    it("should calculate total points across multiple answers", () => {
      const answers: Answer[] = [
        {
          question: {
            id: "1",
            text: "Which of the following are prime numbers?",
            options: [
              { id: generateNumericId(), text: "2", correct: true },
              { id: generateNumericId(), text: "3", correct: true },
              { id: generateNumericId(), text: "4", correct: false },
              { id: generateNumericId(), text: "5", correct: true },
            ],
            difficulty: "easy",
            categories: ["math"],
          },
          userAnswers: [
            {
              option: { id: generateNumericId(), text: "2", correct: true },
              isSelected: true,
            },
            {
              option: { id: generateNumericId(), text: "3", correct: true },
              isSelected: true,
            },
            {
              option: { id: generateNumericId(), text: "4", correct: false },
              isSelected: false,
            },
            {
              option: { id: generateNumericId(), text: "5", correct: true },
              isSelected: true,
            },
          ],
          achievedPoints: 0,
        },
        {
          question: {
            id: "2",
            text: "Which of the following are even numbers?",
            options: [
              { id: generateNumericId(), text: "1", correct: false },
              { id: generateNumericId(), text: "2", correct: true },
              { id: generateNumericId(), text: "3", correct: false },
              { id: generateNumericId(), text: "4", correct: true },
            ],
            difficulty: "easy",
            categories: ["math"],
          },
          userAnswers: [
            {
              option: { id: generateNumericId(), text: "1", correct: false },
              isSelected: true,
            },
            {
              option: { id: generateNumericId(), text: "2", correct: true },
              isSelected: false,
            },
            {
              option: { id: generateNumericId(), text: "3", correct: false },
              isSelected: true,
            },
            {
              option: { id: generateNumericId(), text: "4", correct: true },
              isSelected: true,
            },
          ],
          achievedPoints: 0,
        },
      ];
      const result = ScoringService.recalculateTotalPoints(answers);

      expect(result).toBe(4);
    });
  });

  describe("calculateCategoryPoints", () => {
    it("should calculate points grouped by difficulty", () => {
      const answers: Answer[] = [
        {
          question: {
            id: "1",
            text: "Prime numbers?",
            options: [],
            difficulty: "easy",
            categories: ["math"],
          },
          userAnswers: [],
          achievedPoints: 3,
        },
        {
          question: {
            id: "2",
            text: "Even numbers?",
            options: [],
            difficulty: "medium",
            categories: ["math"],
          },
          userAnswers: [],
          achievedPoints: 2,
        },
        {
          question: {
            id: "3",
            text: "Rainbow colors?",
            options: [],
            difficulty: "hard",
            categories: ["science"],
          },
          userAnswers: [],
          achievedPoints: 4,
        },
      ];

      const result = ScoringService.calculateCategoryPoints(answers);
      expect(result).toEqual({
        easy: 3,
        medium: 2,
        hard: 4,
      });
    });
  });
});
