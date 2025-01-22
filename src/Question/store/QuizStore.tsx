import { create } from "zustand";
import {
  getFromLocalStorage,
  saveToLocalStorage,
  shuffleArray,
} from "../../utils/helpers";
import questionsData from "../datas/questionData";
import type { AnswerOption, Question } from "../type/QuestionType";

interface QuizStore {
  questionList: Question[];
  userAnswers: Record<string, AnswerOption[]>;
  quizSet: Question[];
  selectedCategories: string[];
  setUserAnswer: (questionId: string, answers: AnswerOption[]) => void;
  toggleAnswer: (questionId: string, answer: AnswerOption) => void;
  createQuiz: () => void;
  setQuizSet: (newQuizSet: Question[]) => void;
  setSelectedCategories: (categories: string[]) => void;
  filterQuestionsByCategories: () => void;
  createNewRandomQuizSet: () => void;
  calculatePoints: () => {
    totalPoints: number;
    categoryPoints: Record<string, number>;
  };
}

const useQuizStore = create<QuizStore>((set, get) => ({
  questionList: questionsData,
  userAnswers: getFromLocalStorage("userAnswers", {}),
  quizSet: getFromLocalStorage("quizSet", questionsData),
  selectedCategories: [],

  setQuizSet: (newQuizSet) => {
    saveToLocalStorage("quizSet", newQuizSet);
    set({ quizSet: newQuizSet });
  },

  setSelectedCategories: (categories: string[]) => {
    set({ selectedCategories: categories });
    get().filterQuestionsByCategories();
  },

  filterQuestionsByCategories: () => {
    const { selectedCategories } = get();
    const filteredQuestions = selectedCategories.length
      ? questionsData.filter((question) =>
          selectedCategories.every((category) =>
            question.category.includes(category)
          )
        )
      : questionsData;
    set({ quizSet: filteredQuestions });
  },

  createQuiz: () => {
    const { selectedCategories, questionList } = get();
    const filteredQuestions = selectedCategories.length
      ? questionList.filter((quiz) =>
          selectedCategories.every((cat) => quiz.category.includes(cat))
        )
      : questionList;
    const shuffledQuestions = shuffleArray(filteredQuestions);

    const newQuizSet = shuffledQuestions.slice(0, 5);

    const quizWithShuffledAnswers = newQuizSet.map((quiz) => ({
      ...quiz,
      answerOptions: shuffleArray(quiz.answerOptions),
    }));

    saveToLocalStorage("quizSet", quizWithShuffledAnswers);

    set({ quizSet: quizWithShuffledAnswers });
  },

  createNewRandomQuizSet: () => {
    set({ selectedCategories: [] });
    get().filterQuestionsByCategories();
  },

  setUserAnswer: (questionId: string, answers: AnswerOption[]) =>
    set((state) => {
      const updatedAnswers = {
        ...state.userAnswers,
        [questionId]: answers,
      };
      saveToLocalStorage("userAnswers", updatedAnswers);
      return { userAnswers: updatedAnswers };
    }),

  toggleAnswer: (questionId: string, answer: AnswerOption) =>
    set((state) => {
      const updatedAnswers = {
        ...state.userAnswers,
        [questionId]: toggleAnswerInList(
          state.userAnswers[questionId] || [],
          answer
        ),
      };
      saveToLocalStorage("userAnswers", updatedAnswers);
      return { userAnswers: updatedAnswers };
    }),
  calculatePoints: () => {
    const { quizSet, userAnswers } = get();

    let totalPoints = 0;
    const categoryPoints: Record<string, number> = {
      easy: 0,
      medium: 0,
      hard: 0,
    };

    quizSet.forEach((question) => {
      let points: number = 0;
      const userSelectedAnswers = userAnswers[question.id] || [];
      const correctAnswerOptions = question.answerOptions.filter(
        (option) => option.isCorrect
      );
      const incorrectAnswerOptions = question.answerOptions.filter(
        (option) => !option.isCorrect
      );
      const correctAnswer = userSelectedAnswers.filter(
        (option) => option.isCorrect
      );
      const incorrectAnswer = userSelectedAnswers.filter(
        (option) => !option.isCorrect
      );

      const correctOptionAmmount = correctAnswerOptions.length;
      const correctAnswerAmmount = correctAnswer.length;
      const incorrectOptionAmmount = incorrectAnswerOptions.length;
      const incorrectAnswerAmmount = incorrectAnswer.length;

      if (question.difficultyLevel === "easy") {
        points =
          correctOptionAmmount === correctAnswerAmmount &&
          incorrectOptionAmmount === incorrectAnswerAmmount
            ? 1
            : 0;
      } else if (question.difficultyLevel === "medium") {
        if (
          correctOptionAmmount === correctAnswerAmmount &&
          incorrectOptionAmmount === incorrectAnswerAmmount
        ) {
          points = 1;
        } else if (incorrectOptionAmmount - incorrectAnswerAmmount === -1) {
          points = 0.5;
        } else {
          points = 0;
        }
      } else if (question.difficultyLevel === "hard") {
        const allCorrectAnswers = question.answerOptions.filter(
          (opt) => opt.isCorrect
        );
        const selectedCorrectAnswers = userSelectedAnswers.filter(
          (opt) => opt.isCorrect
        );
        const selectedIncorrectAnswers = userSelectedAnswers.filter(
          (opt) => !opt.isCorrect
        );

        const incorrectCount =
          selectedIncorrectAnswers.length +
          (allCorrectAnswers.length - selectedCorrectAnswers.length);

        points = selectedCorrectAnswers.length * 0.5 - incorrectCount;
        if (points < 0) {
          points = 0;
        }
      }

      totalPoints += points;
      const difficulty = question.difficultyLevel || "easy";
      categoryPoints[difficulty] += points;
    });

    return { totalPoints, categoryPoints };
  },
}));
const toggleAnswerInList = (
  currentAnswers: AnswerOption[],
  answer: AnswerOption
): AnswerOption[] => {
  return currentAnswers.includes(answer)
    ? currentAnswers.filter((a) => a !== answer)
    : [...currentAnswers, answer];
};

export default useQuizStore;
