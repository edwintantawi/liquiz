export const createQuestionsPrompt = `
Topic: {topic}

Questions context:
{context}

Create {numberOfQuestions} of questions that related with the topic and context above and unique each other to help students understand the topic.
If the question leads to a certain context, then enter that context in the question statement!

Questions can be in any of the following formats:
- Multiple choice
- Yes/no question
- Open-ended question
- Fill in the blanks
- Story based question
- Usecase based question

Force to use the same language from context above for questions and the answers!

A multiple choice item consists of a problem/statement, known as the stem, and a list of suggested solutions/options, known as alternatives.
The alternatives consist of one correct or best alternative, which is the answer, and incorrect or inferior alternatives, known as distractors.

The stem should be meaningful by itself and should present a definite problem. A stem that presents a definite problem allows a focus on the learning outcome. A stem that does not present a clear problem, however, may test students' ability to draw inferences from vague descriptions rather serving as a more direct test of students' achievement of the learning outcome.

The stem should not contain irrelevant material, which can decrease the reliability and the validity of the test scores.

The stem should be negatively stated only when significant learning outcomes require it. Students often have difficulty understanding items with negative phrasing.
If a significant learning outcome requires negative phrasing, such as identification of dangerous laboratory or clinical practices, the negative element should be emphasized with italics or capitalization.

The stem should be a question or a partial sentence. A question stem is preferable because it allows the student to focus on answering the question rather than holding the partial sentence in working memory and sequentially completing it with each alternative. The cognitive load is increased when the stem is constructed with an initial or interior blank, so this construction should be avoided.

All alternatives should be plausible. The function of the incorrect alternatives is to serve as distractors,which should be selected by students who did not achieve the learning outcome but ignored by students who did achieve the learning outcome. Alternatives that are implausible don't serve as functional distractors and thus should not be used. Common student errors provide the best source of distractors.

Alternatives should be stated clearly and concisely. Items that are excessively wordy assess students' reading ability rather than their attainment of the learning objective.

Alternatives should be mutually exclusive. Alternatives with overlapping content may be considered "trick" items by test-takers, excessive use of which can erode trust and respect for the testing process.

Alternatives should be homogenous in content. Alternatives that are heterogeneous in content can provide cues to student about the correct answer.

Alternatives should be free from clues about which response is correct. Sophisticated test-takers are alert to inadvertent clues to the correct answer, such differences in grammar, length, formatting, and language choice in the alternatives.

The alternatives "all of the above" and "none of the above" should not be used. When "all of the above" is used as an answer, test-takers who can identify more than one alternative as correct can select the correct answer even if unsure about other alternative(s). When "none of the above" is used as an alternative, test-takers who can eliminate a single option can thereby eliminate a second option. In either case, students can use partial knowledge to arrive at a correct answer.

The alternatives should be presented in a logical order (e.g., alphabetical or numerical) to avoid a bias toward certain positions.

Ensures that the questions won't be repeated

{format_instructions}

ONLY RETURN WITHOUT ADDITIONAL MESSAGE!
`;

export const createHistorySummaryPrompt = `
Exam topic: {topic}

Provide a summary in the form of feedback and suggestions from all the following test results to the user so that the user can understand where the user already understands the topic and also where the user still does not or does not understand the topic based on the results of the user's answers, provide feedback that allows the user to learn from it

The feedback and suggestions should use the same language as the exam question!

Feedback and suggestions are based on the entire question on the exam not per question!

Add useful feedback that your users can learn from. Educate them so they will do better next time.

The exam result:
{questions}
`;
