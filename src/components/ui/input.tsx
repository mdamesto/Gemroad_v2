"use client";

import styled from "styled-components";

export const Input = styled.input`
  width: 100%;
  padding: 10px 14px;
  background: #1a1a25;
  border: 1px solid #2a2a35;
  border-radius: 8px;
  color: #e5e5e5;
  font-size: 0.9rem;
  outline: none;
  transition: border-color 0.2s;

  &:focus {
    border-color: #e63946;
  }

  &::placeholder {
    color: #555566;
  }
`;

export const Label = styled.label`
  display: block;
  margin-bottom: 6px;
  font-size: 0.85rem;
  font-weight: 500;
  color: #8888aa;
`;

export const FormGroup = styled.div`
  margin-bottom: 16px;
`;

export const FormError = styled.p`
  margin-top: 6px;
  font-size: 0.8rem;
  color: #e63946;
`;
