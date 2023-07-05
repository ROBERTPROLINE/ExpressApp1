const { DATE } = require("mysql/lib/protocol/constants/types");

people = [
  {
    name: "robert",
    age: 25,
    dob: "Aug 24 1998 22:39:49 GMT+0200 (Eastern European Standard Time)",
  },
  {
    name: "lisa",
    age: 3,
    dob: "May 16 2024 22:39:49 GMT+0200 (Eastern European Standard Time)",
  },
  {
    name: "similar",
    age: 23,
    dob: "April 27 2000 22:39:49 GMT+0200 (Eastern European Standard Time)",
  },
  {
    name: "natasha",
    age: 6,
    dob: "June 14 2016 22:39:49 GMT+0200 (Eastern European Standard Time)",
  },
];

let np = people.map((ele) => {
  return ele["name"];
});

console.log(np);

return {
  userid: userData._id,
  fullname: userData.fullname,
  email: userData.email,
  experience: userData.experience,
  profession: userData.profession,
  skills: userData.skills,
  references: userData.references,
  projects: userData.projects,
  vacancies: userData.vacancies,
  userApplication,
};
