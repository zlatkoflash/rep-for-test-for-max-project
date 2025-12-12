'use client'

import { useSearch } from "@/app/providers/SearchProvider";
import { User } from "@/interface/interface";
import { useTranslations } from "next-intl";
import { Alert, Col, Container, FormControl, InputGroup, Nav, Navbar, NavLink, Pagination, Row, Table } from "react-bootstrap";
import InputGroupText from "react-bootstrap/esm/InputGroupText";

export default function SearchAndTable() {



    const t = useTranslations('SearchDemo');

    const {
        actions,
        state
    } = useSearch();
    const {
        searchData,
        fetchState,
        searchString,
        pageIndex,
        itemsPerPage,
        countPages,
    } = state;

    const {
        setSearchString,
        setPageIndex,
        nextPage,
        prevPage,
        setSearchData,
        setFetchState,
    } = actions;

    console.log("searchData:", searchData);

    return <section className="py-5">
        <Container>
            <Row>
                <Col>

                    <Navbar expand="lg" className="bg-body-tertiary">
                        <Nav className="me-auto">
                            <NavLink href="/en">English</NavLink>
                            <NavLink href="/fr">Français</NavLink>
                        </Nav>
                    </Navbar>


                    {
                        fetchState === 'loading' && (
                            <Alert variant="secondary">
                                {t('loadingDataMessage')}

                                <div className="spinner"></div>
                            </Alert>
                        )
                    }
                    {
                        fetchState === 'loaded' && (
                            <Alert variant="success">{t('loadedDataMessage')}

                                <p><i>I set the spinner only to show, in the loading alert it load very fast</i></p>
                                <div className="spinner"></div>
                            </Alert>
                        )
                    }
                    {
                        fetchState === 'error' && (
                            <Alert variant="danger">
                                {t('errorDataMessage')}
                                <p><i>I set the spinner only to show, in the loading alert it load very fast</i></p>
                                <div className="spinner"></div>
                            </Alert>
                        )
                    }

                    <h1>{t('title')}</h1>

                    <InputGroup className="mb-3">
                        <FormControl
                            placeholder={t('searchLabel')}
                            aria-label={t('searchLabel')}
                            aria-describedby="basic-addon2"
                            value={searchString}
                            onChange={(e) => setSearchString(e.target.value)}
                        />
                        <InputGroupText id="basic-addon2">{t('searchLabel')}</InputGroupText>
                    </InputGroup>

                    <Table striped bordered hover variant="dark" responsive>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>{t('name')}</th>
                                <th>{t('username')}</th>
                                <th>{t('email')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                searchData.map((item: User) => (
                                    <tr key={`user-${item.id}`}>
                                        <td>{item.id}</td>
                                        <td>{item.name}</td>
                                        <td>{item.username}</td>
                                        <td>{item.email}</td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </Table>

                    {
                        countPages > 1 && (

                            <Pagination className="justify-content-center mt-5">
                                {
                                    Array.from({ length: countPages }, (_, i) => (
                                        <Pagination.Item
                                            key={`page-${i}`}
                                            active={i + 1 === pageIndex}
                                            onClick={() => setPageIndex(i + 1)}
                                        >
                                            {i + 1}
                                        </Pagination.Item>
                                    ))
                                }
                            </Pagination>
                        )
                    }

                </Col>
            </Row>
        </Container>
    </section>
}