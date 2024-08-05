import { SignUp } from '@clerk/clerk-react';

const Register = () => {
  return (
    <div className=" flex flex-col items-center justify-center h-[100vh]">
      <SignUp path="/sign-up" />
    </div>
  );
};

export default Register;
