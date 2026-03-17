import { useState } from "react";
import { supabaseClient } from "../config/supabaseClient";
import { useNavigate, useLocation } from "react-router-dom";
import { UserAuth } from "../context/AuthContext";

const Home = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [tutors, setTutors] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

 
  const { session, loading } = UserAuth(); 
  const navigate = useNavigate();
  const location = useLocation();


  const handleBooking = (tutorId) => {
    if (!session) {
      navigate("/signup", {
        state: {
          assignedTutor: tutorId,
          prevPath: location.pathname,
        },
      });
    } else {
      navigate(`/book/${tutorId}`);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    setHasSearched(false);

    const { data, error } = await supabaseClient
      .from("profiles")
      .select(
        `
        id,
        full_name,
        avatar_url,
        bio,
        tutor_courses!inner (
          courses!inner (
            course_code,
            course_name
          )
        )
      `,
      )
      .ilike("tutor_courses.courses.course_code", `%${searchQuery.trim()}%`);

    if (error) {
      console.error("Search failed:", error.message);
    } else {
      setTutors(data);
      setHasSearched(true);
    }

    setIsLoading(false);
  };

  // 3. Move the loading check INSIDE the return to keep hooks stable
  return (
    <div className="max-w-6xl mx-auto px-4">
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500 animate-pulse">Loading UB Tutor Link...</p>
        </div>
      ) : (
        <>
          <section className="py-16 md:py-24 text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-primary leading-tight">
              Master Your Modules with <br className="hidden md:block" /> UB's Top
              Tutors.
            </h1>

            <p className="text-center text-gray-600 mt-6 max-w-2xl mx-auto text-lg">
              Connect with experienced students and professionals for 1-on-1
              learning tailored to the University of Botswana curriculum.
            </p>

            <div className="flex flex-col md:flex-row items-stretch justify-center mt-10 shadow-xl rounded-lg overflow-hidden max-w-3xl mx-auto border border-gray-100">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setHasSearched(false);
                  if (e.target.value.trim() === "") {
                    setTutors([]);
                  }
                }}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="Enter course code. e.g., CSI332"
                className="p-4 w-full outline-none text-black bg-white grow"
              />
              <button
                onClick={handleSearch}
                disabled={isLoading}
                className="bg-accent text-white py-4 px-10 font-bold cursor-pointer hover:bg-red-800 transition-all disabled:bg-gray-400 whitespace-nowrap"
              >
                {isLoading ? "Searching..." : "Search"}
              </button>
            </div>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
            {tutors.length > 0
              ? tutors.map((tutor) => (
                  <div
                    key={tutor.id}
                    className="p-6 border border-gray-200 rounded-xl shadow-sm bg-white hover:shadow-md transition-shadow"
                  >
                    <h3 className="text-xl font-bold text-primary">
                      {tutor.full_name}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-2 my-3">
                      {tutor.bio || "No bio provided yet."}
                    </p>
                    <div className="flex flex-wrap gap-2 items-center">
                      {tutor.tutor_courses.map((item, index) => (
                        <span
                          key={index}
                          className="bg-secondary/10 text-secondary text-xs px-3 py-1 rounded-full font-bold"
                        >
                          {item.courses.course_code}
                        </span>
                      ))}
                    </div>
                    <button 
                      onClick={() => handleBooking(tutor.id)} 
                      className="ml-auto bg-accent text-white text-xs font-bold px-4 py-2 rounded-lg cursor-pointer mt-4 hover:bg-red-800 transition-colors shadow-sm active:scale-95"
                    >
                      Book Lesson
                    </button>
                  </div>
                ))
              : !isLoading &&
                hasSearched && (
                  <p className="col-span-full text-center text-gray-500 italic">
                    No tutors found for "{searchQuery}"
                  </p>
                )}
          </div>
        </>
      )}
    </div>
  );
};

export default Home;