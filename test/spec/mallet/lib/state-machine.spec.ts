import { only, skip, slow, suite, test, timeout } from 'mocha-typescript';
import { expect, spy } from 'chai';

// TODO: add @ imports
import { state, StateMachine } from '../../../../src/mallet/lib/state-machine';

class TestState extends StateMachine {
    @state public static StateA;
    @state public static StateB;
    @state public static StateC;
}

@suite class StateMachineSpec {
    testState = new TestState();

    @test 'it provides reverse lookup for each state'() {
        const stateA = TestState[TestState.StateA];
        expect(TestState[stateA]).to.equal(TestState.StateA);

        const stateB = TestState[TestState.StateB];
        expect(TestState[stateB]).to.equal(TestState.StateB);

        const stateC = TestState[TestState.StateC];
        expect(TestState[stateC]).to.equal(TestState.StateC);
    }

    @test 'addState: adds new states to the instance state'() {
        this.testState.addState(TestState.StateA);
        expect(this.testState.is(TestState.StateA)).to.be.true;
        this.testState.addState(TestState.StateB);
        expect(this.testState.is(TestState.StateA)).to.be.true;
        expect(this.testState.is(TestState.StateB)).to.be.true;
        expect(this.testState.is(TestState.StateB | TestState.StateA)).to.be.true;
    }

    @test 'setState: replaces existing state with new value'() {
        this.testState.addState(TestState.StateA);
        this.testState.setState(TestState.StateB);
        expect(this.testState.is(TestState.StateA)).to.be.false;
        expect(this.testState.is(TestState.StateB)).to.be.true;
    }

    @test 'setState: accepts a composite state value'() {
        this.testState.setState(TestState.StateA | TestState.StateB);
        expect(this.testState.is(TestState.StateA)).to.be.true;
        expect(this.testState.is(TestState.StateB)).to.be.true;
    }

    @test 'treats each state as a distinct internal value'() {
        this.testState.setState(TestState.StateA);
        expect(this.testState.is(TestState.StateA)).to.be.true;
        expect(this.testState.is(TestState.StateB)).to.be.false;
        expect(this.testState.is(TestState.StateC)).to.be.false;

        this.testState.setState(TestState.StateB);
        expect(this.testState.is(TestState.StateA)).to.be.false;
        expect(this.testState.is(TestState.StateB)).to.be.true;
        expect(this.testState.is(TestState.StateC)).to.be.false;

        this.testState.setState(TestState.StateC);
        expect(this.testState.is(TestState.StateA)).to.be.false;
        expect(this.testState.is(TestState.StateB)).to.be.false;
        expect(this.testState.is(TestState.StateC)).to.be.true;
    }

    @test 'removeState: removes an individual state'() {
        this.testState.setState(TestState.StateA | TestState.StateB);
        this.testState.removeState(TestState.StateB);
        expect(this.testState.is(TestState.StateA)).to.be.true;
        expect(this.testState.is(TestState.StateB)).to.be.false;
    }

    @test 'overrides toString with state value'() {
        this.testState.setState(TestState.StateA | TestState.StateB);
        const result = '' + this.testState;
        expect(result).to.include(TestState[TestState.StateA]);
        expect(result).to.include(TestState[TestState.StateB]);
        expect(result).to.include(this.testState.getState());
    }

    @test 'onState: invokes listener when state is updated with value'() {
        const onStateA = spy();
        this.testState.onState(TestState.StateA, onStateA);
        this.testState.addState(TestState.StateA);
        expect(onStateA).to.have.been.called.once;
    }
}
