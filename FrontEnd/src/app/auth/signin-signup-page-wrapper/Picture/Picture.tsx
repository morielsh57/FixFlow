import LoginPic from '../../../../assets/images/LoginPic.jpg';

const Picture = () => {
  return (
    <div className="signup-signin-pic">
      <img src={LoginPic} className="picture" alt="auth visual" />
    </div>
  );
};

export default Picture;
