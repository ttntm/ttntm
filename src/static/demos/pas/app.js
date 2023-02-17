import { h, render } from 'https://cdn.skypack.dev/preact@10.4.7'
import { useEffect, useState } from 'https://cdn.skypack.dev/preact@10.4.7/hooks'
import htm from 'https://cdn.skypack.dev/htm@3.0.4'

const html = htm.bind(h)

const AutoSuggestList = [
  'Systems Administrator',
  'Front End Developer',
  'Back End Developer',
  'Solution Architect',
  'Consultant',
  'Other'
]

const StatusMsg = {
  en: {
    error: 'Unfortunately, an error has occurred. Please try again later or contact us at demo@example.com.',
    success: 'Submission processed. Thanks!'
  }
}

const FormInputSuggest = ({ className, name, label, isRequired, min, placeholder, showSuggestions, suggestionList, target, type, onChange, onInput, onSuggestionClick }) => {
  const hasTargetVal = target[name] && target[name].length > 0
  
  const htmlAttrs = {
    autocomplete: 'off',
    class: className,
    id: `input_${name}`,
    name: name,
    placeholder: placeholder,
    style: 'width: 100%;',
    type: type
  }

  if (isRequired === true) {
    htmlAttrs['aria-required'] = true
    htmlAttrs.required = true
  }
  
  if (min) {
    htmlAttrs.minlength = min
    htmlAttrs.pattern = `.{${min},}`
  }

  if (hasTargetVal) {
    htmlAttrs.value = target[name]
  }

  let suggestions = hasTargetVal
    ? suggestionList.filter(item => item.toLowerCase().indexOf(target[name].toLowerCase()) > -1)
    : suggestionList

  return html`<div class="form-group w-100" style="position: relative;">
    <label class="text-muted" for="${htmlAttrs.id}" style="margin-bottom: 0.25rem;">${label}</label>
    <input onInput="${onInput}" onChange="${onChange}" ...${htmlAttrs} />
    ${hasTargetVal && suggestions.length > 0 && showSuggestions ? (
      html`<ul class="list-suggest">
        ${suggestions.map((item, index) => {
          return html`<li key="${index}" class="item-suggest" data-name="${name}" onClick="${onSuggestionClick}">
            ${item}
          </li>`
        })}
      </ul>`
    ) : null }
  </div>`
}

const FormStatus = ({ lng, onClick, status, submitted }) => {
  const closeBtnText = lng === 'de' ? 'Schließen' : 'Close'
  return html`
    ${submitted ? (
      html`<div class="form-overlay">
        <div class="overlay-inner">
          ${status.length == 0 ? (
            html`<svg width="38" height="38" viewBox="0 0 38 38" xmlns="http://www.w3.org/2000/svg" stroke="#000">
              <g fill="none" fill-rule="evenodd">
                <g transform="translate(1 1)" stroke-width="2">
                  <circle stroke-opacity=".5" cx="18" cy="18" r="18" />
                  <path d="M36 18c0-9.94-8.06-18-18-18">
                    <animateTransform attributeName="transform" type="rotate" from="0 18 18" to="360 18 18" dur="1s" repeatCount="indefinite" />
                  </path>
                </g>
              </g>
            </svg>`
          ) : (
            html`<p class="text-center" style="margin: 0;">${status}</p>
              <button onClick="${onClick}" class="btn btn-gray" style="margin-top: 2rem;">${closeBtnText}</button>`
          )}
        </div>
      </div>`
    ) : null }
  `
}

export default function App() {
  const Form = () => {
    const [activeControl, setActiveControl] = useState('')
    const [formData, setFormData] = useState({})
    const [formResponse, setFormResponse] = useState('')
    const [submitted, setSubmitted] = useState(false)

    useEffect(() => {
      setFormData({ role: '' })
    }, [])
    
    const handleFormInput = (evt) => {
      let isCheckbox = evt.target.type === 'checkbox'
      let inputName = evt.target.name
      let inputValue = isCheckbox ? evt.target.checked : evt.target.value
      
      setActiveControl(inputName)
      
      setFormData(current => {
        return { ...current, [inputName]: inputValue }
      })
    }

    const onChangeInputSuggest = evt => {
      // The higher delay is needed here because it would otherwise incapacitate 
      // the onClickInputSuggest() method due to race conditions
      setTimeout(() => setActiveControl(''), 200)
    }

    const onClickInputSuggest = evt => {
      setFormData(current => {
        return { ...current, [evt.target.dataset.name]: evt.target.innerText }
      })
      setTimeout(() => setActiveControl(''), 50)
    }

    const onCloseFormStatus = () => { 
      setSubmitted(false)
      setFormResponse('')
    }

    const onSubmitForm = async(e) => {
      e.preventDefault()
      
      setSubmitted(true)
      
      let subData = { ...formData }

      subData.source = 'AutoSuggestDemoForm'

      // --- mock submit
      const later = (delay, value) => new Promise(resolve => setTimeout(resolve, delay, value))
      let updateResponse = await later(500, { eventInstanceId: '1234' })
      console.log(subData)
      // --- mock submit
      
      if (updateResponse.eventInstanceId) {
        setFormResponse(StatusMsg['en'].success)
      } else {
        setFormResponse(StatusMsg['en'].error)
      }
    }
    
    return html`<form id="pas-demo" method="post" onSubmit="${onSubmitForm}">
      <${FormInputSuggest} name="role" isRequired="${true}" min="5" label="Job or Role" placeholder="Job/role" showSuggestions="${activeControl === 'role'}" suggestionList="${AutoSuggestList}" target="${formData}" type="text" onChange="${onChangeInputSuggest}" onInput="${handleFormInput}" onSuggestionClick="${onClickInputSuggest}" />
      <div class="w-100">
        <button id="btn_submit" class="btn-primary" type="submit">Submit</button>
      </div>
    </form>
    <${FormStatus} lng="en" onClick="${onCloseFormStatus}" status="${formResponse}" submitted="${submitted}" />`
  }

  render(html`<${Form} />`, document.querySelector('#form-container'))
}
