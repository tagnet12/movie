import React from 'react';
import { Dropdown } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function SimpleDropdown() {
  return (
    <div className="p-4">
      <Dropdown>
        <Dropdown.Toggle variant="primary" id="dropdown-basic">
          메뉴 선택
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <Dropdown.Item href="#/action-1">옵션 1</Dropdown.Item>
          <Dropdown.Item href="#/action-2">옵션 2</Dropdown.Item>
          <Dropdown.Item href="#/action-3">옵션 3</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
}

export default SimpleDropdown;
