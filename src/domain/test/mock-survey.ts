import { SurveyModel } from '../models/survey'
import { AddSurveyParams } from '../usecases/survey/add-survey'

export const mockSurveyModel = (): SurveyModel => {
  return {
    answers: [
      {
        answer: 'any_answer'
      },
      {
        answer: 'other_answer',
        image: 'any_image'
      }
    ],
    date: new Date(),
    id: 'any_id',
    question: 'any_question'
  }
}

export const mockSurveyModels = (): SurveyModel[] => {
  return [{
    answers: [
      {
        answer: 'any'
      }
    ],
    date: new Date(),
    id: 'any_id',
    question: 'any_question'
  },
  {
    answers: [
      {
        answer: 'any_other'
      }
    ],
    date: new Date(),
    id: 'any_id_other',
    question: 'any_question_other'
  }]
}

export const mockAddSurveyParams = (): AddSurveyParams => {
  return {
    question: 'any_question',
    answers: [{
      image: 'any_image',
      answer: 'any_answer'
    }],
    date: new Date()
  }
}
