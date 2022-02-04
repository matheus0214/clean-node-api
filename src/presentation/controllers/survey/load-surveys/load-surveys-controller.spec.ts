import MockDate from 'mockdate'

import { LoadSurveysController } from './load-surveys-controller'
import { HttpRequest, LoadSurveys } from './load-surveys-protocols'
import { ok, serverError, noContent } from '@/presentation/helpers/http/http-helper'
import { mockLoadSurveys } from '@/presentation/test/mock-load-survey'
import { mockFakeAccountModel, mockSurveyModels } from '@/domain/test'

type SutTypes = {
  sut: LoadSurveysController
  loadSurveysStub: LoadSurveys
}

const mockRequest = (): HttpRequest => {
  return {
    accountId: mockFakeAccountModel().id
  }
}

const makeSut = (): SutTypes => {
  const loadSurveysStub = mockLoadSurveys()
  const sut = new LoadSurveysController(loadSurveysStub)

  return {
    sut,
    loadSurveysStub
  }
}

describe('LoadSurveys Controller', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  it('should call LoadSurveys wit correct value', async () => {
    const { sut, loadSurveysStub } = makeSut()
    const spy = jest.spyOn(loadSurveysStub, 'load')

    const httpRequest = mockRequest()
    await sut.handle(httpRequest)

    expect(spy).toHaveBeenCalled()
    expect(spy).toHaveBeenCalledWith(mockFakeAccountModel().id)
  })

  it('should return 200 on success', async () => {
    const { sut } = makeSut()

    const response = await sut.handle(mockRequest())

    expect(response).toEqual(ok(mockSurveyModels()))
  })

  test('should return 500 if load surveys throws', async () => {
    const { sut, loadSurveysStub } = makeSut()

    jest.spyOn(loadSurveysStub, 'load').mockImplementationOnce(() => {
      throw new Error('')
    })

    const httpResponse = await sut.handle(mockRequest())

    expect(httpResponse).toEqual(serverError(new Error()))
  })

  it('should return 204 if LoadSurveys return empty', async () => {
    const { sut, loadSurveysStub } = makeSut()

    jest.spyOn(loadSurveysStub, 'load').mockReturnValueOnce(Promise.resolve([]))

    const response = await sut.handle(mockRequest())

    expect(response).toEqual(noContent())
  })
})
