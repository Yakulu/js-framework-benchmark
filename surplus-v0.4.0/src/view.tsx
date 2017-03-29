import * as Surplus from 'surplus';
import * as S from 's-js';
import { App } from './controller';

Surplus;

const USE_NON_KEYED_TBODY = location.search.indexOf('keyed') === -1;

type RowTr = HTMLTableRowElement & { _id : HTMLTableCellElement, _label : HTMLAnchorElement };

export let AppView = (app : App) => 
        <div className="container">
            <div className="jumbotron">
                <div className="row">
                    <div className="col-md-6">
                        <h1>Surplus v0.4.0</h1>
                    </div>
                    <div className="col-md-6">
                        <div className="row">
                            <div className="col-sm-6 smallpad">
                                <button type="button" className="btn btn-primary btn-block" id="run" onClick={e => app.run(!USE_NON_KEYED_TBODY)}>Create 1,000 rows</button>
                            </div>
                            <div className="col-sm-6 smallpad">
                                <button type="button" className="btn btn-primary btn-block" id="runlots" onClick={e => app.runLots(!USE_NON_KEYED_TBODY)}>Create 10,000 rows</button>
                            </div>
                            <div className="col-sm-6 smallpad">
                                <button type="button" className="btn btn-primary btn-block" id="add" onClick={e => app.add()}>Append 1,000 rows</button>
                            </div>
                            <div className="col-sm-6 smallpad">
                                <button type="button" className="btn btn-primary btn-block" id="update" onClick={e => app.update()}>Update every 10th row</button>
                            </div>
                            <div className="col-sm-6 smallpad">
                                <button type="button" className="btn btn-primary btn-block" id="clear" onClick={e => app.clear()}>Clear</button>
                            </div>
                            <div className="col-sm-6 smallpad">
                                <button type="button" className="btn btn-primary btn-block" id="swaprows" onClick={e => app.swapRows()}>Swap Rows</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <table className="table table-hover table-striped test-data"  
                onClick = {(e : any) => e.target.matches('.delete') ? app.delete(rowId(e)) : app.select(rowId(e))}>
                { USE_NON_KEYED_TBODY ? TBodyNonKeyed(app) : TBodyKeyed(app) }
            </table>
            <span className="preloadicon glyphicon glyphicon-remove"></span>
        </div>,
    rowId = ({target: el} : {target : HTMLElement}) => { 
        while (el.tagName !== 'TR') el = el.parentElement!; 
        return +el.childNodes[0].textContent!; 
    },
    TBodyKeyed = (app : App) => {
        let trs = app.store.data.mapSample(row =>
            <tr>
                <td className="col-md-1" innerText={row.id}></td>
                <td className="col-md-4">
                    <a innerText={row.label()}></a>
                </td>
                <td className="col-md-1"><a><span className="glyphicon glyphicon-remove delete"></span></a></td>
                <td className="col-md-6"></td>
            </tr>);

        S.on(app.store.selected, () => {
            let sel = app.store.selected(), data = app.store.data();
            trs().forEach((tr, i) => tr.className = data[i].id === sel ? 'danger' : '');
        });
        
        return <tbody>{trs}</tbody>;
    },
    TBodyNonKeyed = (app : App) => {
        var tbody = <tbody></tbody>,
            trs = [] as RowTr[];

        S(() => { // keeps trs in sync with data
            let rows = app.store.data(),
                selectedId = app.store.selected();

            if (rows.length === 0) {
                tbody.textContent = '';
                trs = [];
            } else for (let i = trs.length - 1; i >= rows.length; i--) { 
                tbody.removeChild(trs[i]); 
                trs.pop();
            }

            for (let i = 0; i < rows.length; i++) {
                var row = rows[i],
                    tr : RowTr | undefined = i < trs.length ? trs[i] : tbody.appendChild(
                        (<tr ref={tr}>
                            <td ref={tr!._id} className="col-md-1"></td>
                            <td className="col-md-4">
                                <a ref={tr!._label} className="select"></a>
                            </td>
                            <td className="col-md-1"><a className="delete"><span className="glyphicon glyphicon-remove delete"></span></a></td>
                            <td className="col-md-6"></td>
                        </tr> as RowTr,
                        trs.push(tr!),
                        tr!));

                tr.className = row.id === selectedId ? 'danger' : '';
                tr._id.innerText = row.id + '';
                tr._label.innerText = row.label();
            }
        });
        
        return tbody;
    };