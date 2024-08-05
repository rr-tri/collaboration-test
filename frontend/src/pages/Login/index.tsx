import { SignIn } from '@clerk/clerk-react';

const Login = () => {
  return (
    <div className=" flex flex-col items-center justify-center h-[100vh] ">
      <SignIn path="/sign-in" />
    </div>
  );
};

export default Login;
