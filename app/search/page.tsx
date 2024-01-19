import * as React from 'react';
import { redirect } from 'next/navigation';

import { Container } from '~/components/container';
import { Icons } from '~/components/icons';
import { Question } from '~/components/question';
import { Section } from '~/components/section';
import { SubjectItem } from '~/components/subject/subject-item';
import { TopicItem } from '~/components/topic/topic-item';
import { Alert, AlertDescription, AlertTitle } from '~/components/ui/alert';
import { Button } from '~/components/ui/button';
import { searchByKeyword } from '~/lib/queries/search';

interface SearchPageProps {
  searchParams: { q?: string; back?: string };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  if (!searchParams.q) redirect(searchParams.back || '/');

  const searchResult = await searchByKeyword(searchParams.q);

  return (
    <Container>
      <ul className="space-y-6">
        <li>
          <Section
            title="Subjects"
            description="Search results for subjects"
            endAdornment={
              <Button
                asChild
                size="icon"
                variant="secondary"
                className="border"
              >
                <div>{searchResult.subjects.length}</div>
              </Button>
            }
          >
            <ul className="grid grid-cols-2 gap-2">
              {searchResult.subjects.map((subject) => (
                <li key={subject.id}>
                  <SubjectItem
                    id={subject.id}
                    title={subject.title}
                    description={subject.description}
                    color={subject.color}
                    numberOfTopics={subject.numberOfTopics}
                  />
                </li>
              ))}
              {searchResult.subjects.length === 0 && (
                <li className="col-span-2">
                  <Alert>
                    <Icons.Info size={20} />
                    <AlertTitle>No subjects found</AlertTitle>
                    <AlertDescription>
                      There are no subjects containing this keyword
                    </AlertDescription>
                  </Alert>
                </li>
              )}
            </ul>
          </Section>
        </li>
        <li>
          <Section
            title="Topics"
            description="Search results for topics"
            endAdornment={
              <Button
                asChild
                size="icon"
                variant="secondary"
                className="border"
              >
                <div>{searchResult.topics.length}</div>
              </Button>
            }
          >
            <ul className="space-y-2">
              {searchResult.topics.map((topic) => (
                <li key={topic.id}>
                  <TopicItem
                    id={topic.id}
                    title={topic.title}
                    subject={{
                      id: topic.subject.id,
                      title: topic.subject.title,
                      color: topic.subject.color,
                    }}
                  />
                </li>
              ))}
              {searchResult.topics.length === 0 && (
                <li className="col-span-2">
                  <Alert>
                    <Icons.Info size={20} />
                    <AlertTitle>No topics found</AlertTitle>
                    <AlertDescription>
                      There are no topics containing this keyword
                    </AlertDescription>
                  </Alert>
                </li>
              )}
            </ul>
          </Section>
        </li>
        <li>
          <Section
            title="Questions"
            description="Search results for questions"
            endAdornment={
              <Button
                asChild
                size="icon"
                variant="secondary"
                className="border"
              >
                <div>{searchResult.questions.length}</div>
              </Button>
            }
          >
            <ul className="space-y-2">
              {searchResult.questions.map((question) => (
                <li key={question.id}>
                  <article className="space-y-2 rounded-md border p-3">
                    <TopicItem
                      id={question.topic.id}
                      title={question.topic.title}
                      subject={{
                        id: question.subject.id,
                        title: question.subject.title,
                        color: question.subject.color,
                      }}
                    />
                    <Question statement={question.statement}>
                      {question.options.map((option) => (
                        <Question.Option
                          key={option.id}
                          name={`question.${question.id}`}
                          value={option.id}
                        >
                          {option.statement}
                        </Question.Option>
                      ))}
                    </Question>
                  </article>
                </li>
              ))}
              {searchResult.questions.length === 0 && (
                <li className="col-span-2">
                  <Alert>
                    <Icons.Info size={20} />
                    <AlertTitle>No questions found</AlertTitle>
                    <AlertDescription>
                      There are no questions containing this keyword
                    </AlertDescription>
                  </Alert>
                </li>
              )}
            </ul>
          </Section>
        </li>
      </ul>
    </Container>
  );
}
