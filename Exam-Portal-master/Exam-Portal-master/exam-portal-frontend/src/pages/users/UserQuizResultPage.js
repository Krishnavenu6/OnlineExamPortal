import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { fetchQuizResult } from "../../actions/quizResultActions";
import Message from "../../components/Message";
import SidebarUser from "../../components/SidebarUser";
import * as quizResultConstants from "../../constants/quizResultConstants";
import "./UserQuizResultPage.css";

const UserQuizResultPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const quizResultReducer = useSelector((state) => state.quizResultReducer);
  const [quizResults, setQuizResults] = useState(null);
  const token = JSON.parse(localStorage.getItem("jwtToken"));
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user ? user.userId : null;

  useEffect(() => {
    if (!localStorage.getItem("jwtToken")) navigate("/"); // Moved this check to another useEffect
  }, []); // Added an empty dependency array to run only once after mounting

  useEffect(() => {
    if (quizResults === null) {
      fetchQuizResult(dispatch, userId, token).then((data) => {
        if (data.type === quizResultConstants.FETCH_QUIZ_RESULT_SUCCESS) {
          setQuizResults(data.payload);
        }
      });
    }
  }, [dispatch, quizResults, token, userId]); // Added dependencies

  return (
    <div className="userQuizResultPage__container">
      <div className="userQuizResultPage__sidebar">
        <SidebarUser />
      </div>

      <div className="userQuizResultPage__content">
        {quizResults && quizResults.length !== 0 ? (
          <Table bordered className="userQuizResultPage__content--table">
            <thead>
              <tr>
                <th>Quiz Id</th>
                <th>Quiz Name</th>
                <th>Category Name</th>
                <th>Obtained Marks</th>
                <th>Total Marks</th>
                <th>Date</th>
                <th>Page</th>
              </tr>
            </thead>
            <tbody>
              {quizResults.map((r, index) => (
                <tr key={index}>
                  <td>{r.quiz.quizId}</td>
                  <td>{r.quiz.title}</td>
                  <td>{r.quiz.category.title}</td>
                  <td>{r.totalObtainedMarks}</td>
                  <td>{r.quiz.numOfQuestions * 5}</td>
                  <td>{r.attemptDatetime}</td>
                  <td>
                    <a
                      href="http://127.0.0.1:5500/Exam-Portal-master/Exam-Portal-master/exam-portal-frontend/src/pages/users/ResultPage.html"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Learning Page
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <Message>
            No results to display. Attempt any <Link to="/quizzes">Quiz.</Link>
          </Message>
        )}
      </div>
    </div>
  );
};

export default UserQuizResultPage;
