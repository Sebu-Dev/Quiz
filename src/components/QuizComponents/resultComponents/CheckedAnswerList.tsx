import useQuizStore from "../../../Question/store/QuizStore";
import type { Option, Question } from "../../../Question/type/QuestionType";
import { BaseButton } from "/Users/vwbspk0/Desktop/VsCode/npm-packages/sebu-dev-react-lib";

interface CheckedAnswerListProps {
  question: Question;
}

export const CheckedAnswerList = ({ question }: CheckedAnswerListProps) => {
  const { quizSet } = useQuizStore();

  const getAnswerState = (option: Option) => {
    const answer = quizSet.answers.find((a) => a.question.id === question.id);
    const userAnswer = answer?.userAnswers.find(
      (ua) => ua.option.text === option.text
    );

    const isSelected = userAnswer?.isSelected;
    const isCorrect = option.isCorrect;

    if (isSelected) {
      return isCorrect ? "bg-cyan-500" : "bg-red-500";
    }
    return isCorrect ? "bg-green-400/60" : "bg-gray-600";
  };

  return (
    <ul className="w-full">
      {question.options.map((option, index) => (
        <li key={index} className="flex flex-col">
          <BaseButton
            label={option.text}
            className={`max-h-20 ${getAnswerState(option)}`}
            hoverEffect={{ scale: 1 }}
            tapEffect={{ scale: 1 }}
          />
        </li>
      ))}
    </ul>
  );
};
