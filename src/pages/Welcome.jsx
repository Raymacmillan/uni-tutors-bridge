import { useState } from "react";
import { supabaseClient } from "../config/supabaseClient";

const Welcome = () => {
  const [major, setMajor] = useState("");
  const [studyYear, setStudyYear] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [role, setRole] = useState("student");
  const [hourlyRate, setHourlyRate] = useState(""); // Changed from undefined to empty string
  const [bio, setBio] = useState("");

  const [searchResults, setSearchResults] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [transcriptFile, setTranscriptFile] = useState(null);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState(1);

  const stepTitles = {
    1: "Academic Profile",
    2: "Choose Your Path",
    3: role === "tutor" ? "Tutor Setup" : "Learning Goals",
  };

  const stepDescriptions = {
    1: "Tell us about your studies at UB.",
    2: "Are you here to help or to learn?",
    3: "Finalize your courses and details.",
  };

  const handleStep = (e) => {
    e.preventDefault();
    setError("");
    if (step === 1 && !major) {
      setError("You must fill out your major to continue.");
      return;
    }
    setStep((prev) => prev + 1);
  };

  const handleCourseSearch = async (query) => {
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }
    const { data } = await supabaseClient
      .from("courses")
      .select("*")
      .ilike("course_code", `%${query}%`)
      .limit(5);
    setSearchResults(data || []);
  };

  const addCourse = (course) => {
    if (!selectedCourses.find((c) => c.id === course.id)) {
      setSelectedCourses([...selectedCourses, course]);
    }
    setSearchResults([]);
  };

  const removeCourse = (id) => {
    setSelectedCourses(selectedCourses.filter((c) => c.id !== id));
  };

  const handleFinalSubmit = async () => {
    setLoading(true);
    setError("");

    try {
      const { data: { user } } = await supabaseClient.auth.getUser();
      if (!user) throw new Error("User session not found.");

      let transcriptPath = null;

      // 1. Upload Transcript if Tutor
      if (role === "tutor" && transcriptFile) {
        const fileExt = transcriptFile.name.split(".").pop();
        const fileName = `${user.id}-${Math.random()}.${fileExt}`;
        const filePath = fileName;

        const { error: uploadError } = await supabaseClient.storage
          .from("transcripts")
          .upload(filePath, transcriptFile);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabaseClient.storage
          .from("transcripts")
          .getPublicUrl(filePath);
        transcriptPath = urlData.publicUrl;
      }

      // 2. Update Main Profile
      const { error: profileError } = await supabaseClient
        .from("profiles")
        .update({
          major,
          year_of_study: studyYear,
          whatsapp_number: whatsappNumber,
          role,
          transcript_url: transcriptPath,
          onboarding_completed: true,
        })
        .eq("id", user.id);

      if (profileError) throw profileError;

      // 3. If Tutor, save pricing and bio
      if (role === "tutor") {
        const { error: tutorError } = await supabaseClient
          .from("tutor_profiles")
          .upsert({
            tutor_id: user.id,
            hourly_rate: hourlyRate,
            bio_long: bio
          });
        if (tutorError) throw tutorError;
      }

      // 4. Save Course Links
      const table = role === "tutor" ? "tutor_courses" : "student_interests";
      const idColumn = role === "tutor" ? "tutor_id" : "student_id";

      const courseData = selectedCourses.map((course) => ({
        [idColumn]: user.id,
        course_id: course.id,
      }));

      const { error: courseError } = await supabaseClient
        .from(table)
        .insert(courseData);
      
      if (courseError) throw courseError;

      setSuccess(true);
      setTimeout(() => {
        window.location.href = "/";
      }, 2500);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-10 max-w-2xl mx-auto px-4 pb-20">
      <div className="mb-10 text-center">
        <div className="flex justify-center gap-2 mb-6">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-2 w-12 rounded-full transition-all duration-500 ${
                s <= step ? "bg-accent" : "bg-gray-200"
              }`}
            />
          ))}
        </div>

        <h1 className="text-4xl font-bold text-primary transition-all">
          {stepTitles[step]}
        </h1>
        <p className="text-gray-500 mt-2 text-lg">{stepDescriptions[step]}</p>

        {error && (
          <p className="mt-4 text-red-600 bg-red-50 py-2 px-4 rounded-lg border border-red-200 inline-block text-sm font-medium animate-bounce">
            {error}
          </p>
        )}
      </div>

      {/* STEP 1 */}
      {step === 1 && (
        <div className="max-w-md mx-auto shadow-lg p-10 rounded-2xl bg-white border border-gray-100">
          <form className="space-y-8">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-gray-700">Major *</label>
              <input
                type="text"
                placeholder="e.g. Computer Science"
                value={major}
                onChange={(e) => setMajor(e.target.value)}
                className="p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-primary/20"
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-gray-700">Year Of Study</label>
              <input
                type="number"
                placeholder="e.g. 3"
                value={studyYear}
                onChange={(e) => setStudyYear(e.target.value)}
                className="p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-gray-700">WhatsApp Number</label>
              <input
                type="text"
                placeholder="e.g +26712345678"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                className="p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <button
              type="button"
              onClick={handleStep}
              className="bg-accent p-4 w-full rounded-xl font-bold text-white shadow-md hover:bg-red-900 transition-all active:scale-95"
            >
              Continue
            </button>
          </form>
        </div>
      )}

      {/* STEP 2 */}
      {step === 2 && (
        <div className="max-w-md mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex flex-col gap-4">
            <div
              onClick={() => setRole("student")}
              className={`p-6 rounded-2xl shadow-sm border-2 transition-all cursor-pointer flex flex-col items-center text-center gap-3 ${
                role === "student" ? "border-accent bg-red-50 ring-1 ring-accent" : "border-gray-100 bg-white"
              }`}
            >
              <div className="text-4xl">🎓</div>
              <div>
                <p className="font-bold text-xl text-primary">Student</p>
                <p className="text-sm text-gray-500">I want to learn or find a tutor for my modules.</p>
              </div>
            </div>

            <div
              onClick={() => setRole("tutor")}
              className={`p-6 rounded-2xl shadow-sm border-2 transition-all cursor-pointer flex flex-col items-center text-center gap-3 ${
                role === "tutor" ? "border-accent bg-red-50 ring-1 ring-accent" : "border-gray-100 bg-white"
              }`}
            >
              <div className="text-4xl">📚</div>
              <div>
                <p className="font-bold text-xl text-primary">Tutor</p>
                <p className="text-sm text-gray-500">I want to teach and help other students excel.</p>
              </div>
            </div>

            <div className="flex gap-4 mt-8">
              <button onClick={() => setStep(1)} className="flex-1 py-3 font-bold text-gray-500 hover:text-gray-700">
                Back
              </button>
              <button
                onClick={handleStep}
                className="flex-2 bg-accent p-4 rounded-xl font-bold text-white shadow-lg hover:bg-red-900 transition-all"
              >
                Next Step
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 3 */}
      {step === 3 && (
        <div className="max-w-md mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
          {success ? (
            <div className="bg-white shadow-xl p-10 rounded-2xl text-center">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-2xl font-bold text-primary">Registration Successful!</h2>
              <p className="text-gray-500 mt-2">
                {role === 'tutor' 
                  ? "Your transcript is being reviewed. We'll verify you shortly!" 
                  : "Welcome to UB Tutor Link! Redirecting..."}
              </p>
              <div className="mt-6 flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
              </div>
            </div>
          ) : (
            <div className="bg-white shadow-lg p-8 rounded-2xl border border-gray-100">
              {role === "tutor" && (
                <div className="space-y-6 mb-8">
                  <div>
                    <label className="text-sm font-bold text-gray-700 block mb-2">Hourly Rate (Pula)</label>
                    <div className="relative">
                      <span className="absolute left-3 top-3 text-gray-400">P</span>
                      <input
                        type="number"
                        value={hourlyRate}
                        onChange={(e) => setHourlyRate(e.target.value)}
                        className="w-full p-3 pl-8 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-accent/20"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-bold text-gray-700 block mb-2">Tutor Bio</label>
                    <textarea
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      rows="3"
                      className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-accent/20"
                    />
                  </div>
                  <div className="p-6 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 text-center">
                    <label className="cursor-pointer">
                      <span className="text-accent font-bold">Upload UB Transcript</span>
                      <p className="text-xs text-gray-500 mt-1">PDF (Max 5MB)</p>
                      <input
                        type="file"
                        className="hidden"
                        onChange={(e) => setTranscriptFile(e.target.files[0])}
                      />
                    </label>
                    {transcriptFile && <p className="mt-2 text-sm text-green-600 font-medium">✅ {transcriptFile.name}</p>}
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <label className="text-sm font-bold text-gray-700 block">
                  {role === "tutor" ? "Which modules can you teach?" : "What modules do you need help with?"}
                </label>
                <input
                  type="text"
                  placeholder="Search code (e.g. CSI332)"
                  className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:border-accent"
                  onChange={(e) => handleCourseSearch(e.target.value)}
                />
                {searchResults.length > 0 && (
                  <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-lg bg-gray-50">
                    {searchResults.map((course) => (
                      <div
                        key={course.id}
                        onClick={() => addCourse(course)}
                        className="p-3 hover:bg-accent hover:text-white cursor-pointer transition-colors text-sm border-b last:border-0"
                      >
                        <span className="font-bold">{course.course_code}</span> - {course.course_name}
                      </div>
                    ))}
                  </div>
                )}
                <div className="flex flex-wrap gap-2 mt-4">
                  {selectedCourses.map((course) => (
                    <div key={course.id} className="flex items-center gap-2 bg-red-50 text-accent border border-red-200 px-3 py-1 rounded-full text-sm">
                      {course.course_code}
                      <button onClick={() => removeCourse(course.id)} className="font-bold">×</button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-4 mt-10">
                <button onClick={() => setStep(2)} className="flex-1 py-3 font-bold text-gray-500">Back</button>
                <button
                  onClick={handleFinalSubmit}
                  disabled={loading || selectedCourses.length === 0}
                  className="flex-2 bg-accent p-3 rounded-xl font-bold text-white shadow-md disabled:opacity-50"
                >
                  {loading ? "Processing..." : "Finish Setup"}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Welcome;