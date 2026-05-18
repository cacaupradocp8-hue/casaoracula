# Relatório de Alteração: Sala de Visita Pública

## Detalhes da Alteração
- **Arquivo alterado**: `src/App.tsx`
- **Objetivo**: Tornar a rota `/sala-da-visitante` acessível publicamente, sem exigência de login, para servir como experiência de entrada da Casa Orácula.

## Comparativo de Código

### Rota: `/sala-da-visitante`
- **Antes**:
```tsx
<Route path="/sala-da-visitante" element={<ProtectedRoute><SalaDaVisitante /></ProtectedRoute>} />
```
- **Depois**:
```tsx
<Route path="/sala-da-visitante" element={<SalaDaVisitante />} />
```

### Rota: `/comece-aqui`
- **Antes**:
```tsx
<Route path="/comece-aqui" element={<ProtectedRoute><Navigate to="/sala-da-visitante" replace /></ProtectedRoute>} />
```
- **Depois**:
```tsx
<Route path="/comece-aqui" element={<Navigate to="/sala-da-visitante" replace />} />
```

## Impacto Esperado
- Usuários não autenticados agora podem acessar diretamente `/sala-da-visitante`.
- O redirecionamento de `/comece-aqui` para `/sala-da-visitante` agora funciona para todos os usuários.
- O design, vídeo, mandala e micro-ritual da Sala de Visita permanecem inalterados.
- Se o usuário clicar em "Descobrir minha Voz", ele ainda será redirecionado para o Quiz, que permanece protegido por enquanto.

## Testes Realizados
- [x] Verificação da definição das rotas no arquivo `src/App.tsx`.
- [x] Confirmação da remoção do wrapper `ProtectedRoute` apenas nas rotas especificadas.
- [x] Validação de que as demais rotas (Quiz, Travessia, Clube, etc.) permanecem protegidas.
