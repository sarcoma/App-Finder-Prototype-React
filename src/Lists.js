import React, { Component } from 'react';
import Functions from './Functions';
import List from './List';
import ToolBar from './ToolBar';
import './Lists.css';

export default class Lists extends Component {
    state = {
        industries: [],
        types: [],
        functions: [],
        apps: [],
    };

    showAppData = (data) => {
        console.log(data);
    };

    constructor() {
        super();
        this.searchApps = this.searchApps.bind(this);
        this.filterTypes = this.filterTypes.bind(this);
        this.filterFunctions = this.filterFunctions.bind(this);
        this.filterApps = this.filterApps.bind(this);
    }

    async componentDidMount() {
        const data = await Functions.getData();
        this.setState(data);
    }

    searchApps(value) {
        this.setState((prevState) => ({
            industries: prevState.industries,
            types: prevState.types,
            functions: prevState.functions,
            apps: prevState.apps.map((x) => {
                x.active = x.title.includes(value);
                return x;
            }),
        }));
    }

    filterTypes(data) {
        this.setState((prevState) => ({
            industries: prevState.industries.map((x) => {
                x.selected = data.id === x.id;
                return x;
            }),
            types: prevState.types.map(
                (x) => {
                    x.selected = false;
                    x.active = data.id === 'I0' || data.types.includes(x.id);
                    return x;
                }),
            functions: prevState.functions.map(Functions.setProperties),
            apps: prevState.apps.map(Functions.setProperties),
        }));
    }

    filterFunctions(data) {
        this.setState((prevState) => ({
            industries: prevState.industries,
            types: prevState.types.map((x) => {
                x.selected = data.id === x.id;
                return x;
            }),
            functions: prevState.functions.map(
                (x) => {
                    x.selected = false;
                    x.active = data.id === 'T0' ||
                        data.functions.includes(x.id);
                    return x;
                }),
            apps: prevState.apps.map(Functions.setProperties),
        }));
    };

    filterApps(data) {
        this.setState((prevState) => ({
            industries: prevState.industries,
            types: prevState.types,
            functions: prevState.functions.map((x) => {
                x.selected = data.id === x.id;
                return x;
            }),
            apps: prevState.apps.map(
                (x) => {
                    x.selected = false;
                    x.active = data.id === 'F0' || data.apps.includes(x.id);
                    return x;
                },
            ),
        }));
    };

    renderLists(listType, filter) {
        let list = null;
        if(typeof listType === 'undefined') {
            list = <div>Loading...</div>;
        } else {
            const filteredList = listType.filter((l) => l.active);
            list = filteredList.map(this.setList(filter));
        }
        return list;
    };

    setList(filter) {
        return list =>
            <div key={list.id}>
                <List list={list} filterList={filter}/>
            </div>;
    };

    render() {
        return (
            <div>
                <ToolBar searchApps={this.searchApps} />
                <div className="flex mt3">
                    <div className="pb1 w-25">
                        {this.renderLists(this.state.industries,
                            this.filterTypes)}
                    </div>
                    <div className="pb1 w-25">
                        {this.renderLists(this.state.types,
                            this.filterFunctions)}
                    </div>
                    <div className="pb1 w-25">
                        {this.renderLists(this.state.functions,
                            this.filterApps)}
                    </div>
                    <div className="pb1 w-25">
                        {this.renderLists(this.state.apps, this.showAppData)}
                    </div>
                </div>
            </div>
        );
    }

}