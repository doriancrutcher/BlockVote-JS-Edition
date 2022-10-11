import { NearBindgen, near, call, view, LookupMap } from "near-sdk-js";

@NearBindgen({})
class HelloNear {
  candidateUrl: LookupMap;
  candidatePair: LookupMap;
  voteArray: LookupMap;
  promptArray = [];
  userParticipation = {};

  constructor() {
    this.candidateUrl = new LookupMap("candidateURL");
    this.candidatePair = new LookupMap("candidatePair");
    this.voteArray = new LookupMap("vote Array");
  }

  @call({})
  addUrl({ name, url }) {
    near.log(`url ${url} added for ${name}`);
    this.candidatePair.set(name, url);
  }

  @call({})
  addCandidatePair({ prompt, name1, name2 }) {
    if (!this.candidatePair.containsKey(prompt)) {
      near.log(`adding candidate pair for ${name1} and ${name2}`);
      this.candidatePair.set(prompt, [name1, name2]);
    } else {
      near.log("candidates already exists");
    }
  }

  @call({})
  addToPromptArray({ prompt }) {
    near.log(`adding ${prompt} to prompt array`);
    this.promptArray.push(prompt);
    this.userParticipation[prompt] = [];
  }

  @call({})
  clearPromptArray() {
    this.promptArray = [];
  }

  @call({})
  addVote({ prompt, index }) {
    if (this.voteArray.containsKey(prompt)) {
      near.log("prompt exists adding vote");
      let tempArray = this.voteArray.get(prompt);
      tempArray[index] = tempArray[index] + 1;
      this.voteArray.set(prompt, tempArray);
    } else {
      let newArray = [0, 0];
      newArray[index] = 1;
      this.voteArray.set(prompt, newArray);
    }
  }

  @call({})
  newVote({ prompt }) {
    near.log(`adding fresh vote count to ${prompt}`);
    this.voteArray.set(prompt, [0, 0]);
  }

  @call({})
  recordUser({ prompt, user }) {
    if (prompt in this.userParticipation) {
      let tempArray = this.userParticipation[prompt];
      tempArray.push(user);
    } else {
      this.userParticipation[prompt] = [user];
    }
  }

  // here userParticipation is a lookupMap that ties a key "prompt" to
  // the value of an array of strings
  // I'm trying to push something to this array but JS throws
  // an error shown above.
  // In rust and assembly script you can define the value type
  // of the LookupMap so it doesn't throw this
  // Are you able to do the same for a collection from this collection
  // in the JS SDK?

  // Remember to add this call decorator. This is what allows a user to
  //modify add or change information on the blockchain

  @view({})
  getUrl({ name }) {
    near.log("getting value for:");
    near.log(name);
    return this.candidatePair.get(name);
  }

  @view({})
  didParticipate({ prompt, user }) {
    near.log(prompt);
    near.log(this.userParticipation);
    near.log(this.promptArray);
    if (prompt in this.userParticipation) {
      let getArray = this.userParticipation[prompt];
      return getArray.includes(user);
    } else {
      near.log("prompt not found");
    }
  }

  @view({})
  getAllPrompts() {
    return this.promptArray;
  }

  @view({})
  getVotes({ prompt }) {
    if (this.voteArray.containsKey(prompt)) {
      return this.voteArray.get(prompt);
    } else {
      near.log("no votes exist");
    }
  }

  @view({})
  getCandidatePair({ prompt }) {
    near.log(`looking up candidates for ${prompt}`);
    if (this.candidatePair.containsKey(prompt)) {
      near.log("candidate pair found");
      return this.candidatePair.get(prompt);
    } else {
      near.log("no candidate pair found");
    }
  }
}
