# JavaScript Standardization

This document details the rules and guidelines followed during the JavaScript standardization migration.

## Migration Rules

1. **Preserving Architecture**
   The existing directory structure and architectural layers (F1-F5) have been strictly preserved to maintain familiarity and structural integrity.

2. **PropType Usage**
   React `PropTypes` have been introduced across all components for runtime type checking, replacing the static type checking previously provided by TypeScript interfaces and types.

3. **Avoiding TS Syntax**
   All TypeScript specific syntax has been completely eradicated. This includes:
   - Interfaces and Type Aliases
   - Generic type parameters (`<T>`)
   - Type assertions (`as Type`)
   - Type annotations on variables, parameters, and return types
   
   The codebase now relies purely on standard ES6+ JavaScript.
