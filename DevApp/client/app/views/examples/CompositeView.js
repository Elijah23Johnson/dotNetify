import React from 'react';
import CompositeViewReact from './react/CompositeView';
import CompositeViewKo from './knockout/CompositeView';
import Example from './components/Example';

export default _ => <Example vm="CompositeViewExample" react={<CompositeViewReact />} ko={<CompositeViewKo />} />;
