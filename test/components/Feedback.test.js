/* eslint no-undef: 0 */

import { mount, shallow } from 'enzyme'
import React from 'react'
import sinon from 'sinon'

import Feedback from '../../src/components/Feedback'

describe('Feedback', () => {
  let sandbox

  beforeEach(() => {
    sandbox = sinon.sandbox.create()
  })

  afterEach(() => {
    sandbox.restore()
  })

  it('has "show" class if isOpen prop is true', () => {
    const isOpen = true
    const feedback = shallow(<Feedback isOpen={isOpen} onClose={() => {}} />)
    expect(feedback.find('.feedback.show').length).toEqual(1)
  })

  it('does not have "show" class if isOpen is false or not passed in', () => {
    const feedback = shallow(<Feedback isOpen={false} onClose={() => {}} />)
    expect(feedback.find('.feedback.show').length).toEqual(0)
  })

  it('has a <textarea> for each item in fields prop', () => {
    const fields = [{ id: 'fake', label: 'Fake text field' }]
    const feedback = shallow(<Feedback fields={fields} onClose={() => {}} />)
    expect(feedback.find('textarea').length).toEqual(fields.length)
  })

  describe('clicking the close button', () => {
    const btnSelector = '[aria-label="Close feedback form"]'
    const isShown = true
    let onClose

    beforeEach(() => {
      onClose = sandbox.spy()
    })

    it('calls onClose props', () => {
      const feedback = mount(<Feedback isShown={isShown} onClose={onClose} />)
      feedback.find(btnSelector).simulate('click')

      expect(onClose.callCount).toEqual(1)
    })

    it('restores focus', () => {
      document.activeElement = document.createElement('<button>focus</button>')
      const feedback = mount(<Feedback isShown={isShown} onClose={onClose} />)
      console.log('document', document.activeElement)
    })
  })
})
