import React, { useEffect, useState } from "react";
import "./UserQuizManualPage.css";
import SidebarUser from "../../components/SidebarUser";
import { useParams } from "react-router-dom";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "react-bootstrap";
import Loader from "../../components/Loader";
import { fetchQuizzes } from "../../actions/quizzesActions";

const UserQuizManualPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const urlParams = new URLSearchParams(window.location.search);
  const quizId = urlParams.get("quizId");

  const quizzesReducer = useSelector((state) => state.quizzesReducer);
  const [quizzes, setQuizzes] = useState(quizzesReducer.quizzes);
  const [quiz, setQuiz] = useState(
    quizzes.filter((q) => q.quizId == quizId)[0]
  );
  const token = JSON.parse(localStorage.getItem("jwtToken"));

  const startQuizHandler = (quizTitle, quizId) => {
    navigate(`/questions/?quizId=${quizId}&quizTitle=${quizTitle}`);
  };

  useEffect(() => {
    if (quizzes.length == 0) {
      fetchQuizzes(dispatch, token).then((data) => {
        const temp = data.payload;
        setQuizzes(temp);
        setQuiz(temp.filter((q) => q.quizId == quizId)[0]);
      });
    }
  }, []);

  useEffect(() => {
    if (!localStorage.getItem("jwtToken")) navigate("/");
  }, []);

  return (
    <div className="quizManualPage__container">
      <div className="quizManualPage__sidebar">
        <SidebarUser />
      </div>
      {quiz ? (
        <div className="quizManualPage__content">
          <div className="quizManualPage__content--section">
            <h5>Read the instruction of this page carefully</h5>
            <p style={{ color: "grey" }}>One more step to go</p>
          </div>

          <div className="quizManualPage__content--section">
            <h3>{quiz.title}</h3>
            <p>{quiz.description}</p>
          </div>

          <hr />

          <div>
            <h3>Important Instructions</h3>
            <ul>
              <li>This Exam is only for practice purpose.</li>
              <li>
                You have to submit Exam within <strong>{quiz.numOfQuestions * 2}</strong>.
              </li>
              <li>You can attempt the Exam any number of time.</li>
              <li>
                There are <strong>{quiz.numOfQuestions} questions</strong> in
                this Exam.
              </li>
              <li>This Exam is only for practice purpose.</li>
              <li>
                Total Marks for this Exam is <strong>{quiz.numOfQuestions * 5}.</strong>
              </li>
              <li>All question is of MCQ type.</li>
            </ul>
          </div>

          <hr />

          <div>
            <h3>Attempting Exam</h3>
            <ul>
              <li>
                Click <strong>Start Exam</strong> button to start the Exam.
              </li>
              <li>
                The timer will start the moment, you will click on the Start
                Exam button.
              </li>
              <li>
                You can not resume this Exam if interrupted due to any reason.
              </li>
              <li>
                Click on <strong>Submit Exam</strong> button on completion of
                the Exam.
              </li>
              <li>
                Result of the test is generated automatically in PDF format.
              </li>
            </ul>
          </div>

          <Button
            className="quizManualPage__content--button"
            onClick={() => startQuizHandler(quiz.title, quiz.quizId)}
            style={{
              border: "1px solid grey",
              margin: "2px 8px",
            }}
            variant="primary"
          >{`Start Quiz`}</Button>
        </div>
      ) : (
        <Loader />
      )}
    </div>
  );
};

export default UserQuizManualPage;
