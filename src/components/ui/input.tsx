"use client";

import styled from "styled-components";

export const Input = styled.input`
  width: 100%;
  padding: 10px 14px;
  background: #1e293b;
  border: 1px solid #1e293b;
  border-radius: 8px;
  color: #e5e7eb;
  font-size: 0.9rem;
  outline: none;
  transition: border-color 0.2s;

  &:focus {
    border-color: #38BDF8;
  }

  &::placeholder {
    color: #475569;
  }
`;

export const Label = styled.label`
  display: block;
  margin-bottom: 6px;
  font-size: 0.85rem;
  font-weight: 500;
  color: #94a3b8;
`;

export const FormGroup = styled.div`
  margin-bottom: 16px;
`;

export const FormError = styled.p`
  margin-top: 6px;
  font-size: 0.8rem;
  color: #38BDF8;
`;
