import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { collection, getDocs, updateDoc, doc, query, where, addDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import { db } from './firebase';
import './HomePage.css';

function HomePage() {
  const [latestCourses, setLatestCourses] = useState([]);
  const [recommendedCourses, setRecommendedCourses] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLatestCourses = async () => {
      try {
        const latestCoursesCollection = collection(db, 'courses');
        const latestCoursesSnapshot = await getDocs(latestCoursesCollection);
        const latestCoursesData = latestCoursesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          isFavorite: false,
          clicks: localStorage.getItem(`course_${doc.id}_clicks`) || 0
        }));
        setLatestCourses(latestCoursesData);
      } catch (error) {
        console.error('Error fetching latest courses:', error);
      }
    };

    const fetchRecommendedCourses = async () => {
      try {
        // Fetch recommended courses based on interaction criteria (e.g., visited more than 3 times)
        const recommendedCoursesQuery = collection(db, 'courses');
        const recommendedCoursesSnapshot = await getDocs(recommendedCoursesQuery);
        const recommendedCoursesData = recommendedCoursesSnapshot.docs
          .map(doc => ({
            id: doc.id,
            ...doc.data(),
            isFavorite: false
          }))
          .filter(course => parseInt(course.clicks) >= 3); // Filter courses visited 3 times or more

        setRecommendedCourses(recommendedCoursesData);
      } catch (error) {
        console.error('Error fetching recommended courses:', error);
      }
    };

    fetchLatestCourses();
    fetchRecommendedCourses();

    // Check authentication status on component mount
    const token = localStorage.getItem('authToken');
    if (token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  const toggleFavorite = async (course, isRecommended) => {
    try {
      const courseRef = doc(db, 'courses', course.id);
      await updateDoc(courseRef, {
        isFavorite: !course.isFavorite
      });

      // Update local state based on user action
      if (isRecommended) {
        const updatedRecommendedCourses = recommendedCourses.map(c => {
          if (c.id === course.id) {
            return { ...c, isFavorite: !c.isFavorite };
          }
          return c;
        });
        setRecommendedCourses(updatedRecommendedCourses);
      } else {
        const updatedLatestCourses = latestCourses.map(c => {
          if (c.id === course.id) {
            return { ...c, isFavorite: !c.isFavorite };
          }
          return c;
        });
        setLatestCourses(updatedLatestCourses);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const handleClick = async (course) => {
    try {
      // Log user interaction - course visit
      const userId = getUserId(); // Implement this function to get the current user's ID
      const interactionData = {
        userId: userId,
        courseId: course.id,
        interactionType: 'visit',
        timestamp: serverTimestamp()
      };
      const interactionRef = await addDoc(collection(db, 'userInteractions'), interactionData);
      console.log('Interaction logged:', interactionRef.id);

      setLatestCourses(prevLatestCourses => {
        const updatedCourses = prevLatestCourses.map(c => {
          if (c.id === course.id) {
            const clicks = parseInt(c.clicks) + 1;
            localStorage.setItem(`course_${c.id}_clicks`, clicks.toString());
            return { ...c, clicks };
          }
          return c;
        });
        return updatedCourses;
      });

      setTimeout(async () => {
        const updatedCourse = latestCourses.find(c => c.id === course.id);
        if (parseInt(updatedCourse.clicks) >= 3) {
          // Check if the course is already in recommended courses
          if (!recommendedCourses.some(c => c.id === updatedCourse.id)) {
            setRecommendedCourses(prevRecommendedCourses => [
              ...prevRecommendedCourses,
              { ...updatedCourse, isFavorite: false }
            ]);
          }
        }
      }, 0);
    } catch (error) {
      console.error('Error handling click:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setIsAuthenticated(true);
    navigate('/');
  };

  const getUserId = () => {
    // Implement function to get the current user's ID
    // Example: if using Firebase Authentication
    // const user = firebase.auth().currentUser;
    // return user ? user.uid : null;
    return 'user123'; // Replace with actual implementation
  };

  return (
    <div className="homepage">
      {/* Auth Buttons */}
      <div className="auth-buttons">
        {isAuthenticated ? (
          <>
            <button onClick={() => navigate('/signup')}>Sign Up</button>
            <button onClick={() => navigate('/login')}>Login</button>
          </>
        ) : (
          <button onClick={handleLogout}>Logout</button>
        )}
      </div>

      {/* Navigate to Favorites */}
      <div className="favorites-button">
        <button onClick={() => navigate('/favorites')}>Favorites</button>
      </div>

      {/* Latest Courses Section */}
      <h2 className="section-title">Latest Courses</h2>
      <div className="courses">
        {latestCourses.map(course => (
          <div key={course.id} className="course-item">
            <Link to={`/course/${course.id}`} className="course-link">
              <div className="course-title">{course.title}</div>
            </Link>
            <button onClick={() => toggleFavorite(course, false)}>
              {course.isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
            </button>
            <button onClick={() => handleClick(course)}>Like</button>
          </div>
        ))}
      </div>

      {/* Recommended Courses Section */}
      <h2 className="section-title">Recommended Courses</h2>
      <div className="courses">
        {recommendedCourses.map(course => (
          <div key={course.id} className="course-item">
            <Link to={`/course/${course.id}`} className="course-link">
              <div className="course-title">{course.title}</div>
            </Link>
            <button onClick={() => toggleFavorite(course, true)}>
              {course.isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HomePage;
