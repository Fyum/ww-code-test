import React, { useState, useCallback } from 'react';
import axios from 'axios';
import styled from '@emotion/styled';

const StyledContainer = styled.div`
  margin-top: 20px;
`;

const StyledSection = styled.div`
  display: inline-block;
  width: 100%;
  margin-top: 70px;
  text-align: center;
  > label {
    margin-bottom: 15px;
    display: block;
    font-size: 1.5em;
  }
`;

const taxYearLookup = {
  '2018/19': '2018-04-06',
  '2019/20': '2019-04-06',
};

const ViewContribution = () => {
  const [taxYear, setTaxYear] = useState('2018/19');
  const [income, setIncome] = useState(0);
  const [isSending, setIsSending] = useState(false);
  const [nationalInsurance, setNationalInsurance] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const fetchData = useCallback(async () => {
    setErrorMessage('');
    if (isSending) return;

    setIsSending(true);
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-run-date': taxYearLookup[taxYear],
      },
    };
    try {
      const response = await axios.post('/v1/national-insurance', { income }, options);
      setNationalInsurance(response.data.ni);
    } catch (err) {
      setNationalInsurance(null);
      setErrorMessage('NI could not be calculated, please verify that the inputs are valid');
    }
    setIsSending(false);
  }, [isSending, income, taxYear]);

  return (
    <StyledContainer>
      <StyledSection>
        <label><b>Income</b></label>
        £<input type="number" value={income} onChange={(e) => setIncome(e.target.value)}></input>
      </StyledSection>
      <StyledSection>
        <label><b>Tax year</b></label>
        <select value={taxYear} onChange={(e) => setTaxYear(e.target.value)}>
          <option value="2018/19">2018/19</option>
          <option value="2019/20">2019/20</option>
        </select>
      </StyledSection>
      <StyledSection>
        {
          isSending
            ? 'Calculating...'
            : <button value={isSending} onClick={fetchData}>Calculate</button>
        }
      </StyledSection>
      {
        nationalInsurance !== null
          ?
          <StyledSection>
            <label><b>National insurance contribution</b></label>£{nationalInsurance}
          </StyledSection>
          : ''
      }
      {
        errorMessage && <StyledSection style={{ color: 'red' }}>{errorMessage}</StyledSection>
      }
    </StyledContainer>
  );
};

export default ViewContribution;
