import { SurveyResultModel } from '../models/survey-result'
import { SaveSurveyResultParams } from '../usecases/survey-result/save-survey-result'

export const mockSurveyResultModel = (): SurveyResultModel => {
  return {
    surveyId: 'any_id',
    question: 'any_question',
    answers: [
      {
        answer: 'any_answer',
        count: 0,
        percent: 0,
        isCurrentAccountAnswer: true
      },
      {
        answer: 'other_answer',
        image: 'any_image',
        count: 0,
        percent: 0,
        isCurrentAccountAnswer: true
      }
    ],
    date: new Date()
  }
}

export const mockSurveyResultParams = (): SaveSurveyResultParams => {
  return {
    accountId: 'any_account_id',
    surveyId: 'any_survey_id',
    answer: 'any_answer',
    date: new Date()
  }
}
