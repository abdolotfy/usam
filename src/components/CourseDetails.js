import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebase';
import AddCommentAndRate from './AddCommentAndRate';
import LikeButton from './LikeButton';
import './CourseDetails.css';

function CourseDetails() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const courseDoc = doc(db, 'courses', id); // Use the `id` from useParams() to fetch the specific course
        const courseSnapshot = await getDoc(courseDoc);
        if (courseSnapshot.exists()) {
          setCourse(courseSnapshot.data());
        } else {
          console.error('Course not found');
        }
      } catch (error) {
        console.error('Error fetching course:', error);
      }
    };

    fetchCourse();
  }, [id]);

  if (!course) {
    return <div>Loading...</div>;
  }

  return (
    <div className="course-details">
      <h2 className="course-title">{course.title}</h2>
      <p className="course-description">{course.description}</p>
      <div className="course-rating">Rating: {course.rating}</div>
      <div className="course-reviews">Reviews: {course.reviews}</div>
      <AddCommentAndRate courseId={id} />
    </div>
  );
}

export default CourseDetails;
