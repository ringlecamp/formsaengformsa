import { Link, useHistory } from 'react-router-dom';
import Button from '../ui/Button';
import Container from '../ui/Container';
import LogoutButton from './LogoutButton';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { db, nowSecond } from '../utils/firebase';
import { addForm } from '../store/slices/formSlice';
import * as Icon from 'heroicons-react';
import { Form } from '../model/Forms';
import { _uuid } from '../utils/uuid';

interface NavBarProps {
  logoSrc: string;
}

function NavBar({ logoSrc }: NavBarProps) {
  const { uid } = useAppSelector((state) => state.user.userProfile);
  const history = useHistory();
  const dispatch = useAppDispatch();

  const createForm = () => {
    const now = nowSecond();
    const newForm = {
      isCompleted: false,
      title: '',
      creator: uid,
      createdAt: now,
      editedAt: now,
      questions: [
        {
          questionType: 'text',
          title: '',
          subtitle: '',
          uuid: _uuid(),
          options: [
            { text: '', uuid: _uuid() },
            { text: '', uuid: _uuid() },
          ],
        },
      ],
    } as Form;
    db.collection('forms')
      .add(newForm)
      .then((doc) => {
        dispatch(addForm(newForm));
        history.push(`/form/${doc.id}/creator`);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  if (!uid) return <div></div>;

  return (
    <div>
      <Container>
        <nav
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            height: 60,
            padding: 16,
          }}
        >
          <Link aria-label="logo" to="/form/list">
            <img src={logoSrc} alt="logo" style={{ height: 60, width: 60 }} />
          </Link>
          <ul
            style={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <li>
              <Button
                onClick={createForm}
                size="small"
                color="primary"
                style={{ marginRight: 12 }}
              >
                <Icon.DocumentAdd />
              </Button>
            </li>
            <li>
              <LogoutButton />
            </li>
          </ul>
        </nav>
      </Container>
    </div>
  );
}

export default NavBar;
