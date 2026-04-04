/// <reference types="npm:@types/react@18.3.1" />

import * as React from 'npm:react@18.3.1'

import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from 'npm:@react-email/components@0.0.22'

interface ReauthenticationEmailProps {
  token: string
}

export const ReauthenticationEmail = ({ token }: ReauthenticationEmailProps) => (
  <Html lang="pt-BR" dir="ltr">
    <Head />
    <Preview>Seu código de verificação — Casa ORÁCULA</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={header}>
          <Text style={headerText}>CASA ORÁCULA</Text>
        </Section>
        <Section style={content}>
          <Heading style={h1}>Código de verificação</Heading>
          <Text style={text}>Use o código abaixo para confirmar sua identidade:</Text>
          <Text style={codeStyle}>{token}</Text>
          <Text style={footerText}>
            Este código expira em breve. Se você não solicitou, pode ignorar este email.
          </Text>
        </Section>
        <Section style={footerSection}>
          <Text style={footerBrand}>Casa ORÁCULA — Formação Simbólica</Text>
        </Section>
      </Container>
    </Body>
  </Html>
)

export default ReauthenticationEmail

const main = { backgroundColor: '#ffffff', fontFamily: "Georgia, 'Times New Roman', serif" }
const container = { maxWidth: '520px', margin: '0 auto' }
const header = { backgroundColor: '#0E1A24', padding: '24px', textAlign: 'center' as const, borderRadius: '12px 12px 0 0' }
const headerText = { color: '#C9A45C', fontSize: '16px', fontWeight: '600' as const, letterSpacing: '3px', margin: '0' }
const content = { padding: '32px 24px' }
const h1 = { fontSize: '22px', fontWeight: '600' as const, color: '#0E1A24', margin: '0 0 20px' }
const text = { fontSize: '15px', color: '#4a4a68', lineHeight: '1.7', margin: '0 0 24px' }
const codeStyle = { fontFamily: 'Courier, monospace', fontSize: '28px', fontWeight: 'bold' as const, color: '#C9A45C', margin: '0 0 30px', letterSpacing: '4px' }
const footerText = { fontSize: '13px', color: '#999999', margin: '28px 0 0' }
const footerSection = { padding: '16px 24px', borderTop: '1px solid #eee', textAlign: 'center' as const }
const footerBrand = { fontSize: '11px', color: '#999', margin: '0' }
