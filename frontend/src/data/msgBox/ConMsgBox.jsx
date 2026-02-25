import { Modal, Button } from 'react-bootstrap';

function ConMsgBox(props){

    // 모달 확인 버튼 클릭
    const handleConfirm = () => {
      props.onClose();      // 모달 종료
// alert(props.action);
      if(props.action == 'reg'){ props.handleRegist(); }   // 등록하기
      if(props.action == 'mod'){ props.handleUpdate(); }   // 수정하기
      if(props.action == 'del'){ props.handleDelete(); }   // 삭제하기   
    }

    // 모달 취소 버튼 클릭
    const handleCancel = () => {
        props.onCancel?.();   // ✅ 취소 시에만 action 복원 콜백 호출        
        props.onClose();      // 모달 종료
    }

    return(
        <div>
             {/* 확인 모달 */}
                <Modal show={props.showModal} onHide={handleCancel} centered>
                    <Modal.Header style={{backgroundColor: 'lightskyblue'}}> Cine Park </Modal.Header>
                    <br></br>
                    <Modal.Body style={{
                        padding: '12px 30px',
                        textAlign: 'center',
                        fontSize: '18px',
                        fontWeight: '500',
                        color: '#333'
                    }}>
                        {props.modalMessage}하시겠습니까?
                    </Modal.Body>
                    <Modal.Footer style={{
                        border: 'none',
                        justifyContent: 'center',
                        paddingBottom: '30px',
                        gap: '10px'
                    }}>
                        <Button variant="primary" onClick={handleConfirm} style={{
                            padding: '10px 30px',
                            borderRadius: '8px'
                        }}>
                            확인
                        </Button>
                        <Button variant="secondary" onClick={handleCancel} style={{
                            padding: '10px 30px',
                            borderRadius: '8px'
                        }}>
                            취소
                        </Button>  
                    </Modal.Footer>
                </Modal>
        </div>
    )
}

export default ConMsgBox;