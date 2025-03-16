import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Card, Button, Container, Row, Col } from "react-bootstrap";

const Home = () => {
  const [packages, setPackages] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/datapackages")
      .then((response) => setPackages(response.data))
      .catch((error) => console.error("Error fetching datapackages:", error));
  }, []);

  return (
    <Container>
      <h2 className="my-4 text-center">Available Data Packages</h2>
      <Row>
        {packages.map((pkg) => (
          <Col key={pkg._id} md={4} className="mb-4">
            <Card>
              <Card.Body>
              <Card.Title>{pkg.name}</Card.Title>

              <Card.Text>Price: Ksh {pkg.price}</Card.Text>

          
                <Link to={`/purchase/${pkg._id}`}>
                  <Button variant="primary">Buy Now</Button>
                </Link>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Home;