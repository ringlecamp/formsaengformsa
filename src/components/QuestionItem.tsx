import { ChangeEvent } from 'react';
import styled from 'styled-components';
import { Question, QuestionType } from '../model/Forms';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  removeQuestion,
  setQuestionSubtitle,
  setQuestionTitle,
  setQuestionType,
} from '../store/slices/formSlice';
import Button from '../ui/Button';
import TextArea from '../ui/TextArea';
import TextInput from '../ui/TextInput';
import * as Icon from 'heroicons-react';
import MarkupSwitchByType from './MarkupSwitchByType';
import {
  QuestionCard,
  QuestionContent,
  QuestionIndex,
  QuestionTitle,
  QuestionTitleDevider,
  TopWindow,
  TypeOption,
  TypeSelect,
  TypeSelectArrowCustom,
  TypeSelectContainer,
} from '../ui/StyledComponents';

interface QuestionProps {
  question: Question;
  index: number;
}

function QuestionItem({ question, index }: QuestionProps) {
  const form = useAppSelector((state) => state.form.form);

  const dispatch = useAppDispatch();

  const removeQuestionHandler = () => {
    dispatch(removeQuestion({ index: index }));
  };

  const changeTitle = (e: ChangeEvent<HTMLInputElement>) => {
    dispatch(setQuestionTitle({ newTitle: e.target.value, index: index }));
  };
  const changeSubtitle = (e: ChangeEvent<HTMLTextAreaElement>) => {
    dispatch(
      setQuestionSubtitle({ newSubtitle: e.target.value, index: index })
    );
  };

  const questionTypeHandleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const newType = e.target.value as QuestionType;
    dispatch(setQuestionType({ newType, index }));
  };

  return (
    <QuestionCard>
      <TopWindow>
        <Button size="small" onClick={removeQuestionHandler}>
          <Icon.X size={15} />
        </Button>
        <QuestionIndex>
          {index + 1}번째 질문 <Icon.ChatOutline />
        </QuestionIndex>
      </TopWindow>
      <QuestionContent>
        <QuestionTitleDevider>
          <QuestionTitle>
            <TextInput
              value={question.title}
              onChange={(e) => changeTitle(e)}
              fill
              placeholder="질문 제목을 입력해주세요"
            />
            <TextArea
              value={question.subtitle}
              onChange={(e) => changeSubtitle(e)}
              fill
              placeholder="질문 부제목을 입력해주세요 (선택)"
              style={{ marginTop: 8 }}
            />
          </QuestionTitle>
          <TypeSelectContainer style={{ marginLeft: 12 }}>
            <TypeSelect
              value={question.questionType}
              onChange={questionTypeHandleChange}
            >
              <TypeOption value="text">주관식 답변</TypeOption>
              <TypeOption value="radio">단일 선택</TypeOption>
              <TypeOption value="checkbox">다중 선택</TypeOption>
            </TypeSelect>
            <TypeSelectArrowCustom />
          </TypeSelectContainer>
        </QuestionTitleDevider>
        {/* 질문 타입별 마크업 */}
        <MarkupSwitchByType
          question={question}
          index={index}
          style={{ marginTop: 6 }}
        />
      </QuestionContent>
    </QuestionCard>
  );
}

export default QuestionItem;
