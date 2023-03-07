/**
 * This utility populates the skills table in datastore with some predefined values so that
 * we have "seed data".
 */

const model = require('../model')

function dumpAndPopulateSkills(){

    // get all existing skills
    let existSkills = model.getItemsNoPaginate('skills')

    // loop through and delete (not the most efficient, but whatever)
    for(let skill of existSkills){
        model.deleteItem('skills', skill.id)
    }

    // populate skills with list from below
    for(let skill of skills){
        try{
            model.postItem('skills', {"description": skill})
        } catch(e){
            console.error(`problem creating ${skill}`)
        }
    }

}

const skills = [
    "Python", 
    "Javascript",
    "Java",
    "Flutter",
    "Dart",
    "Golang",
    "C (Programming Language)",
    "C#",
    "C++",
    "Ruby on Rails",
    "Node.js",
    ".NET",
    "Flask",
    "Pandas",
    "Docker",
    "MS Office",
    "Google Suite",
    "GCP",
    "Excel",
    "Office",
    "Google Docs",
    "Powerpoint",
    "Access",
    "Azure",
    "AWS",
    "Linux",
    "Mac OS",
    "PHP",
    "Perl",
    "HTML",
    "CSS (Cascading Style Sheets)",
    "MySQL",
    "SQL",
    "JSON",
    "AI (Artificial Intelligence",
    "Machine Learning",
    "SQLite",
    "SAP BI",
    "Network Security",
    "System Administration",
    "Unix",
    "Cloud",
    "Kubernetes",
    "Debugging",
    "Jenkins",
    "Terraform",
    "CI/CD (Continuous Improvement)",
    "BASH Scripting",
    "React",
    "Angular",
    "Vue",
    "Javascript Frameworks",
    "React Native",
    "Swift",
    "Kotlin",
    "Communication",
    "Leadership",
]