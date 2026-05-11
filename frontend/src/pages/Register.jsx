// Register.jsx
import RegisterForm from '../components/auth/RegisterForm';

const Register = () => {
  return (
    <div className="register-page-wrap">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600&display=swap');

        .register-page-wrap {
          background: var(--midnight);
          min-height: calc(100vh - 200px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 100px 20px 80px;
          font-family: 'DM Sans', sans-serif;
        }

        :root {
          --midnight: #0a0f1e;
          --navy: #0d1635;
          --navy-2: #131c42;
          --gold: #f0a500;
          --gold-light: #fbbf24;
          --muted: #8892aa;
          --white: #ffffff;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .register-page-wrap {
          animation: fadeIn 0.5s ease;
        }

        @media (max-width: 640px) {
          .register-page-wrap {
            padding: 80px 16px 60px;
          }
        }
      `}</style>
      <RegisterForm />
    </div>
  );
};

export default Register;