import styled from 'styled-components';

const LegalTextLayout = styled.div`
  max-width: 680px;
  text-align: left;
  margin: 0 auto;
  padding: 75px 0 28px;

  h1 {
    font-size: 38px;
    color: #fff;
    margin: 20px 0;
  }

  .subheading {
    font-size: 17px;
    color: #ccc;
    margin-bottom: 49px;
  }

  h2 {
    font-size: 25px;
    color: #fff;
    margin: 35px 0;
    line-height: 36px;
  }

  h3 {
    font-size: 21px;
    color: #fff;
    margin: 28px 0;
  }

  p {
    margin: 28px 0;
  }

  p,
  ul {
    font-size: 18px;
    line-height: 28px;
  }

  ul {
    list-style: disc;
    margin-left: 45px;
  }

  ul ul {
    list-style: circle;
  }

  a {
    text-decoration: underline;
    color: #00c4c4;
  }

  strong {
    font-weight: 500;
  }
`;

export default LegalTextLayout;
