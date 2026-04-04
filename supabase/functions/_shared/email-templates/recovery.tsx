/// <reference types="npm:@types/react@18.3.1" />

import * as React from 'npm:react@18.3.1'

import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from 'npm:@react-email/components@0.0.22'

interface RecoveryEmailProps {
  siteName: string
  confirmationUrl: string
}

export const RecoveryEmail = ({ siteName, confirmationUrl }: RecoveryEmailProps) => (
  <Html lang="pt-BR" dir="ltr">
    <Head />
    <Preview>Redefinir sua senha — Casa ORÁCULA</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={header}>
          <Text style={headerText}>CASA ORÁCULA</Text>
        </Section>
        <Section style={content}>
          <Heading style={h1}>Redefinir sua senha</Heading>
          <Text style={text}>
            Recebemos um pedido para redefinir sua senha na Casa ORÁCULA.
            Clique no botão abaixo para criar uma nova senha.
          </Text>
          <Button style={button} href={confirmationUrl}>
            Redefinir Senha
          </Button>
          <Text style={footerText}>
            Se você não solicitou, pode ignorar este email. Sua senha não será alterada.
          </Text>
        </Section>
        <Section style={footerSection}>
          <Text style={footerBrand}>Casa ORÁCULA — Formação Simbólica</Text>
        </Section>
      </Container>
    </Body>
  </Html>
)

export default RecoveryEmail

const main = { backgroundColor: '#ffffff', fontFamily: "Georgia, 'Times New Roman', serif" }
const container = { maxWidth: '520px', margin: '0 auto' }
const header = { backgroundColor: '#0E1A24', padding: '24px', textAlign: 'center' as const, borderRadius: '12px 12px 0 0' }
const headerText = { color: '#C9A45C', fontSize: '16px', fontWeight: '600' as const, letterSpacing: '3px', margin: '0' }
const content = { padding: '32px 24px' }
const h1 = { fontSize: '22px', fontWeight: '600' as const, color: '#0E1A24', margin: '0 0 20px' }
const text = { fontSize: '15px', color: '#4a4a68', lineHeight: '1.7', margin: '0 0 24px' }
const button = { backgroundColor: '#C9A45C', color: '#0E1A24', fontSize: '14px', fontWeight: '600' as const, borderRadius: '8px', padding: '14px 28px', textDecoration: 'none' }
const footerText = { fontSize: '13px', color: '#999999', margin: '28px 0 0' }
const footerSection = { padding: '16px 24px', borderTop: '1px solid #eee', textAlign: 'center' as const }
const footerBrand = { fontSize: '11px', color: '#999', margin: '0' }
