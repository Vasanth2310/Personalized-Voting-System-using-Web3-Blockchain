#![no_std]

use soroban_sdk::{contract, contracttype, contractimpl, Env, Symbol, symbol_short, Address};

#[contracttype]
#[derive(Clone)]
pub struct Poll {
    pub yes: u64,
    pub no: u64,
    pub total: u64,
    pub yes_votes: u64, // New variable to store total number of 'YES' votes
    pub no_votes: u64,  // New variable to store total number of 'NO' votes
}

const POLL: Symbol = symbol_short!("POLL");

#[contracttype]
pub enum Registry {
    Record(Address)
}

#[contracttype]
#[derive(Clone)]
pub struct Record {
    pub selected: Symbol,
    pub votes: u64,
    pub time: u64,
}

const YES: Symbol = symbol_short!("YES");
const NO: Symbol = symbol_short!("NO");

#[contract]
pub struct VoteContract;

#[contractimpl]
impl VoteContract {
    pub fn record_votes(env: Env, user: Address, selected: Symbol) -> Symbol {
        let mut records = Self::view_voter(env.clone(), user.clone());
        user.require_auth();
        let votes: u64 = 1;
        let time = env.ledger().timestamp();

        if records.time != 0 {
            panic!("Already voted");
        } else {
            let mut poll = Self::view_poll(env.clone());
            records.selected = selected;
            records.votes = votes;
            records.time = time;

            if records.selected == YES {
                poll.yes += votes;
                poll.yes_votes += 1; // Increment 'YES' vote count
            } else if records.selected == NO {
                poll.no += votes;
                poll.no_votes += 1; // Increment 'NO' vote count
            } else {
                panic!("Invalid vote selection");
            }

            poll.total += votes;

            env.storage().instance().set(&Registry::Record(user), &records);
            env.storage().instance().set(&POLL, &poll);

            symbol_short!("Recorded")
        }
    }

    pub fn view_poll(env: Env) -> Poll {
        env.storage().instance().get(&POLL).unwrap_or(Poll {
            yes: 0,
            no: 0,
            total: 0,
            yes_votes: 0,
            no_votes: 0,
        })
    }
    
    pub fn view_voter(env: Env, voter: Address) -> Record {
        let key = Registry::Record(voter.clone());
        env.storage().instance().get(&key).unwrap_or(Record {
            selected: symbol_short!("none"),
            votes: 0,
            time: 0,
        })
    }

    pub fn withdraw_votes(env: Env, user: Address) -> Symbol {
        let mut records = Self::view_voter(env.clone(), user.clone());
        user.require_auth();
        if records.time == 0 {
            panic!("No vote to withdraw");
        } else {
            let mut poll = Self::view_poll(env.clone());
            if records.selected == YES {
                poll.yes -= records.votes;
                poll.yes_votes -= 1; // Decrement 'YES' vote count
            } else if records.selected == NO {
                poll.no -= records.votes;
                poll.no_votes -= 1; // Decrement 'NO' vote count
            }

            poll.total -= records.votes;

            records.selected = symbol_short!("none");
            records.votes = 0;
            records.time = 0;

            env.storage().instance().set(&Registry::Record(user), &records);
            env.storage().instance().set(&POLL, &poll);

            symbol_short!("Withdrawn")
        }
    }

    pub fn change_vote(env: Env, user: Address, new_vote: Symbol) -> Symbol {
        let mut records = Self::view_voter(env.clone(), user.clone());
        user.require_auth();
        if records.time == 0 {
            panic!("No vote to change");
        } else {
            let mut poll = Self::view_poll(env.clone());
            if records.selected == YES {
                poll.yes -= records.votes;
                poll.yes_votes -= 1; // Decrement previous 'YES' vote count
            } else if records.selected == NO {
                poll.no -= records.votes;
                poll.no_votes -= 1; // Decrement previous 'NO' vote count
            }

            if new_vote == YES {
                poll.yes += records.votes;
                poll.yes_votes += 1; // Increment new 'YES' vote count
            } else if new_vote == NO {
                poll.no += records.votes;
                poll.no_votes += 1; // Increment new 'NO' vote count
            } else {
                panic!("Invalid vote selection");
            }

            records.selected = new_vote;

            env.storage().instance().set(&Registry::Record(user), &records);
            env.storage().instance().set(&POLL, &poll);

            symbol_short!("Changed")
        }
    }

    pub fn set_deadline(env: Env, deadline: u64) -> Symbol {
        env.storage().instance().set(&symbol_short!("DLNE"), &deadline);
        symbol_short!("SetDLne")
    }

    pub fn announce_results(env: Env) -> (u64, u64, u64) {
        let poll = Self::view_poll(env);
        (poll.yes, poll.no, poll.total)
    }

    pub fn reset_poll(env: Env) -> Symbol {
        env.storage().instance().remove(&POLL);
        symbol_short!("Reset")
    }
}
