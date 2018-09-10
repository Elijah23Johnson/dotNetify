import React from 'react';
import { Markdown, withTheme } from 'dotnetify-elements';
import Article from '../components/Article';
import Expander from '../components/Expander';
import { currentFramework, frameworkSelectEvent } from 'app/components/SelectFramework';

class Overview extends React.Component {
  constructor() {
    super();
    this.state = { framework: currentFramework };
    this.unsubs = frameworkSelectEvent.subscribe(framework => this.setState({ framework: framework }));
  }
  componentWillUnmount() {
    this.unsubs();
  }
  render() {
    const { framework } = this.state;
    return framework === 'Knockout' ? <OverviewKO /> : <OverviewReact />;
  }
}

const OverviewReact = _ => (
  <Article vm="Overview" id="Content">
    <Markdown id="Content">
      <Expander label={<SeeItLive />} content={<RealTimePush />} connectOnExpand />
      <Expander label={<SeeItLive />} content={<ServerUpdate />} />
    </Markdown>
  </Article>
);

const OverviewKO = _ => (
  <Article vm="OverviewKO" id="Content">
    <Markdown id="Content" />
  </Article>
);

const SeeItLive = _ => <b>See It Live!</b>;

class RealTimePush extends React.Component {
  constructor(props) {
    super(props);
    this.vm = dotnetify.react.connect('RealTimePush', this);
    this.state = { Greetings: '', ServerTime: '' };
  }
  componentWillUnmount() {
    this.vm.$destroy();
  }
  render() {
    return (
      <div>
        <p>{this.state.Greetings}</p>
        <p>Server time is: {this.state.ServerTime}</p>
      </div>
    );
  }
}

class ServerUpdate extends React.Component {
  constructor(props) {
    super(props);
    this.vm = dotnetify.react.connect('ServerUpdate', this);
    this.state = { Greetings: '', firstName: '', lastName: '' };
  }
  componentWillUnmount() {
    this.vm.$destroy();
  }
  render() {
    const handleFirstName = e => this.setState({ firstName: e.target.value });
    const handleLastName = e => this.setState({ lastName: e.target.value });
    const handleSubmit = () => this.vm.$dispatch({ Submit: { FirstName: this.state.firstName, LastName: this.state.lastName } });
    return (
      <div>
        <div>{this.state.Greetings}</div>
        <input type="text" value={this.state.firstName} onChange={handleFirstName} />
        <input type="text" value={this.state.lastName} onChange={handleLastName} />
        <button onClick={handleSubmit}>Submit</button>
      </div>
    );
  }
}

export default withTheme(Overview);
