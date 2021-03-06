import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Form } from '../model/Forms';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setForm } from '../store/slices/formSlice';
import { activateLoading, deactivateLoading } from '../store/slices/uiSlice';
import Loading from '../ui/Loading';
import { Paper } from '../ui/StyledComponents';
import QuestionItemRespondent from '../components/QuestionItemRespondent';
import TextInput from '../ui/TextInput';
import { db, nowSecond } from '../utils/firebase';
import { _uuid } from '../utils/uuid';
import {
  setResponse,
  setResponserUuid,
  clearResponse,
} from '../store/slices/responseSlice';
import { clearForm } from '../store/slices/formSlice';
import Button from '../ui/Button';
import * as Icon from 'heroicons-react';
import { Response, QuestionResponse } from '../model/Response';
import { Question } from '../model/Forms';
import LoadingFormResponse from '../ui/LoadingFormResponse';

function FormResponsePage() {
  const { formId }: { formId: string } = useParams();
  const response = useAppSelector((state) => state.response);
  const form = useAppSelector((state) => state.form.form);
  let responserUuid = useAppSelector((state) => state.response.responserUuid);
  const isLoading = useAppSelector((state) => state.ui.isLoading);
  const dispatch = useAppDispatch();

  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    dispatch(activateLoading());
    dispatch(clearForm());
    dispatch(clearResponse());
    if (!responserUuid) {
      responserUuid = _uuid();
      dispatch(setResponserUuid(responserUuid));
    }
    const newResponse = { responserUuid, questions: [] } as Response;
    db.collection('forms')
      .doc(formId)
      .get()
      .then((doc) => {
        if (doc.exists) {
          const newForm = doc.data() as Form;
          newForm.uuid = doc.id;
          dispatch(setForm(newForm));

          newForm.questions.forEach((question: Question) => {
            const newQuestion = {} as QuestionResponse;
            newQuestion.uuid = question.uuid;
            newQuestion.type = question.questionType;
            switch (newQuestion.type) {
              case 'text':
                newQuestion.textAnswer = '';
                break;
              case 'checkbox':
                newQuestion.answer = [];
                break;
              case 'radio':
                newQuestion.answer = [];
                break;
              default:
                break;
            }
            newResponse.questions.push(newQuestion);
          });
        } else {
          console.log('not exists');
        }
      })
      .then(() => {
        dispatch(setResponse(newResponse));
      })
      .then(() => {
        db.collection('forms')
          .doc(formId)
          .collection('response')
          .doc(responserUuid)
          .get()
          .then((doc) => {
            if (doc.exists) {
              setIsSubmitted(true);
            } else {
              console.log('not exist');
            }
            dispatch(deactivateLoading());
          })
          .catch((error) => {
            console.log(error);
            dispatch(deactivateLoading());
          });
      })
      .catch(() => {
        dispatch(deactivateLoading());
      });
  }, []);

  const responseRef = db.collection('forms').doc(formId).collection('response');

  const submitClickHandler = () => {
    dispatch(activateLoading());
    const newResponse = { ...response };
    responseRef
      .doc(responserUuid)
      .set(newResponse)
      .then(() => {
        alert('??????????????? ?????????????????????.????');
        dispatch(deactivateLoading());
        setIsSubmitted(true);
      })
      .catch((error) => {
        dispatch(deactivateLoading());
        console.log(error);
      });
  };

  if (isLoading === true) {
    return (
      <Paper>
        <LoadingFormResponse />
      </Paper>
    );
  }

  if (isSubmitted) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
        }}
      >
        <div
          style={{
            background: 'white',
            padding: '16px 30px',
            borderRadius: 16,
            marginBottom: 16,
          }}
        >
          <h2>????????? ????????????????????? ????</h2>
          ?????? ???????????? ??? ????????????
        </div>
        <a href="https://formsaengformsa.com">
          <Button color="primary" isCompleted={true}>
            ?????????????????? ?????? ????????? ?????????
          </Button>
        </a>
      </div>
    );
  }

  if (form.isCompleted === false) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 20,
          height: '75vh',
          color: 'gray',
        }}
      >
        <span>
          <Icon.DocumentSearch
            size={80}
            color="lightgray"
          ></Icon.DocumentSearch>
        </span>
        ?????? ???????????? ?????? ????????????.
      </div>
    );
  }

  return (
    <div>
      <Loading isLoading={isLoading} />
      <Paper>
        <h2>{form.title}</h2>
        <ul>
          {form.questions.map((question, index) => (
            <QuestionItemRespondent
              key={question.uuid}
              question={question}
              index={index}
            ></QuestionItemRespondent>
          ))}
        </ul>
      </Paper>
      <Button
        color="primary"
        onClick={submitClickHandler}
        style={{ margin: 16 }}
      >
        <span
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          ????????????
          <Icon.FolderAdd />
        </span>
      </Button>
      <br />??? ???????????? <a href="https://formsaengformsa.com">????????????</a>??????
      ?????????????????? <br />
      <small>
        Invalidation check version: 0.1 <br /> responser: {responserUuid}
      </small>
    </div>
  );
}

export default FormResponsePage;
