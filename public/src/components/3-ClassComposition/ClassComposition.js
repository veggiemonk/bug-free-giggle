import m from 'mithril';

import StyleVariantA from './StyleVariantA/StyleVariantA';
import StyleVariantB from './StyleVariantB/StyleVariantB';

export default class ClassComposition extends Component {

  render() {
    return (
      <div>
        <StyleVariantA />
        <br />
        <StyleVariantB />
      </div>
    );
  }

};
