import LoginForm from './LoginForm';

export default function AuthPage({ onLogin }) {
  return <LoginForm onLogin={onLogin} />;
}
