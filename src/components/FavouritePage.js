import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebase';
import './FavoritePage.css';

function FavoritesPage() {
  const [favoriteCourses, setFavoriteCourses] = useState([]);

  useEffect(() => {
    const fetchFavoriteCourses = async () => {
      try {
        const coursesCollection = collection(db, 'courses');
        const coursesSnapshot = await getDocs(coursesCollection);
        const favoriteCoursesData = coursesSnapshot.docs
          .map(doc => ({
            id: doc.id,
            ...doc.data()
          }))
          .filter(course => course.isFavorite);
        setFavoriteCourses(favoriteCoursesData);
      } catch (error) {
        console.error('Error fetching favorite courses:', error);
      }
    };

    fetchFavoriteCourses();
  }, []);

  return (
    <div className="favorites-page">
      <h2 className="section-title">Favorite Courses</h2>
      <div className="courses">
        {favoriteCourses.map(course => (
          <div key={course.id} className="course-item">
            <Link to={`/course/${course.id}`} className="course-link">
              <div className="course-title">{course.title}</div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FavoritesPage;
