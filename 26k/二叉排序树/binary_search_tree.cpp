
#include <cstdio>
#include <cassert>

#include <wajic.h>
// #define eat
// #define WA_EXPORT(k) eat

#include "binary_tree.hpp"

template<class BinaryTreeRef>
class BinarySearchHelper{
public:
    std::vector<bool> directions;

    BinaryTreeRef find(BinaryTreeRef ref, Element target){
        if (ref.is_null()){
            return ref;
        }
        if (target < ref.element()){
            // continue searching left
            self.directions.push_back(false);
            return self.find(ref.left(), target);
        } else if (ref.element() < target){
            // continue searching right
            self.directions.push_back(true);
            return self.find(ref.right(), target);
        } else {
            return ref;
        }
    }

    auto path(BinaryTreeRef root_ref){
        auto p = std::vector<BinaryTreeRef>();
        p.push_back(root_ref);
        auto ref = BinaryTreeRef(root_ref);
        for (auto i : self.directions){
            if (i){
                ref = ref.right();
            } else {
                ref = ref.left();
            }
            p.push_back(ref);
        }
        return p;
    }
};

template<class BinaryTreeRef>
class BinarySearchTree{
protected:
    BinaryTreeRef root_ref;
public:
    BinarySearchTree(BinaryTreeRef root_ref)
        : root_ref(root_ref)
    {}
    bool has(Element element){
        auto helper = BinarySearchHelper<BinaryTreeRef>();
        auto result = helper.find(self.root_ref, element);
        return !result.is_null();
    }
    void insert(Element element, std::function<void(BinarySearchHelper<BinaryTreeRef> &)> then = {}){
        auto helper = BinarySearchHelper<BinaryTreeRef>();
        auto result = helper.find(self.root_ref, element);
        if (!result.is_null()){
            // 插入到右子树的最左边
            result = result.right();
            helper.directions.push_back(true);
            while (!result.is_null()){
                result = result.left();
                helper.directions.push_back(false);
            }
        }
        BinaryTreeRefCommon::ensure_element(result) = element;
        if (then) then(helper);
    }
    void remove_ref(BinaryTreeRef ref, std::vector<bool> &directions){
        if (!ref.right().is_null()){
            // 用右子树最左边替换
            auto right_neighbor = ref.right();
            directions.push_back(true); // 记录经过的路径，提供给then函数
            while (!right_neighbor.left().is_null()){
                right_neighbor = right_neighbor.left();
                directions.push_back(false);
            }
            auto element = right_neighbor.element();
            self.remove_ref(right_neighbor, directions);
            ref.element() = element;
        } else if (!ref.left().is_null()){
            // 用左子树最右边替换
            auto left_neighbor = ref.left();
            directions.push_back(false); // 记录经过的路径，提供给then函数
            while (!left_neighbor.right().is_null()){
                left_neighbor = left_neighbor.right();
                directions.push_back(true);
            }
            auto element = left_neighbor.element();
            self.remove_ref(left_neighbor, directions);
            ref.element() = element;
        } else {
            // 直接删除
            ref.remove_self();
        }
    }
    bool remove(Element element, std::function<void(BinarySearchHelper<BinaryTreeRef> &)> then = {}){
        auto helper = BinarySearchHelper<BinaryTreeRef>();
        auto result = helper.find(self.root_ref, element);
        if (result.is_null()){
            return false;
        } else {
            self.remove_ref(result, helper.directions);
            if (then) then(helper);
            return true;
        }
    }
    void iterate(std::function<void(Element)> f){
        return BinaryTreeRefCommon::iterate(self.root_ref, f);
    }
};

template<class BinaryTreeRef>
class AVLTree : public BinarySearchTree<BinaryTreeRef>{
public:
    AVLTree(BinaryTreeRef root_ref)
        : BinarySearchTree<BinaryTreeRef>(root_ref)
    {}
    void rotate_raise_left(BinaryTreeRef ref){
        ref.left().swap(ref.right());
        std::swap(ref.element(), ref.right().element());
        ref.left().swap(ref.right().left());
        ref.right().left().swap(ref.right().right());
    }

    void rotate_raise_right(BinaryTreeRef ref){
        ref.right().swap(ref.left());
        std::swap(ref.element(), ref.left().element());
        ref.right().swap(ref.left().right());
        ref.left().right().swap(ref.left().left());
    }

    void ll_rotation(BinaryTreeRef ref){
        self.rotate_raise_left(ref);
        ref.element().balance_factor = 0;
        ref.right().element().balance_factor = 0;
    }

    void rr_rotation(BinaryTreeRef ref){
        self.rotate_raise_right(ref);
        ref.element().balance_factor = 0;
        ref.left().element().balance_factor = 0;
    }

    void lr_rotation(BinaryTreeRef ref){
        auto is_left_insertion = ref.left().right().element().balance_factor == -1;
        auto is_right_insertion = ref.left().right().element().balance_factor == 1;
        self.rotate_raise_right(ref.left());
        self.rotate_raise_left(ref);
        ref.element().balance_factor = 0;
        ref.left().element().balance_factor = !is_right_insertion ? 0 : -1;
        ref.right().element().balance_factor = !is_left_insertion ? 0 : 1;
    }
    
    void rl_rotation(BinaryTreeRef ref){
        auto is_left_insertion = ref.right().left().element().balance_factor == -1;
        auto is_right_insertion = ref.right().left().element().balance_factor == 1;
        self.rotate_raise_left(ref.right());
        self.rotate_raise_right(ref);
        ref.element().balance_factor = 0;
        ref.left().element().balance_factor = !is_right_insertion ? 0 : -1;
        ref.right().element().balance_factor = !is_left_insertion ? 0 : 1;
    }

    void adjust_balance_factor(BinarySearchHelper<BinaryTreeRef> &helper, bool is_removal){
        // 回溯父结点，更新balance_factor
        // 获取完整路径
        auto path = helper.path(self.root_ref);

        path.pop_back(); // remove result first
        while (!path.empty()){
            auto ref = path.back();
            path.pop_back();
            if (helper.directions.back()){ // right subtree changed
                ref.element().balance_factor += is_removal ? -1 : 1;
            } else {
                ref.element().balance_factor -= is_removal ? -1 : 1;
            }
            helper.directions.pop_back();
            if (ref.element().balance_factor == 0){
                // 不用继续修改父节点了
                break;
            } else if (std::abs(ref.element().balance_factor) == 1){
                // 需要继续修改父节点
                // pass
            } else if (std::abs(ref.element().balance_factor) == 2){
                // 旋转
                auto ref_bf = ref.element().balance_factor;
                if (ref_bf == -2){
                    if (ref.left().element().balance_factor == -1){
                        // 新插入的让左左变深
                        self.ll_rotation(ref);
                    } else if (ref.left().element().balance_factor == 1) {
                        // 新插入的让左右变深
                        self.lr_rotation(ref);
                    }
                } else if (ref_bf == 2){
                    if (ref.right().element().balance_factor == 1){
                        // 新插入的让右右变深
                        self.rr_rotation(ref);
                    } else if (ref.right().element().balance_factor == -1) {
                        // 新插入的让右左变深
                        self.rl_rotation(ref);
                    }
                }
                // 已经平衡了，不继续更新上方
                break;
            } else {
                // 不该出现的情况，说明之前就没有旋转好，或者balance_factor没更新好
                assert(false);
            }
        }
    }

    void insert(Element element, std::function<void(BinarySearchHelper<BinaryTreeRef> &)> then = {}){
        self.BinarySearchTree<BinaryTreeRef>::insert(element, [&](auto &helper){
            self.adjust_balance_factor(helper, false);
            if (then) then(helper);
        });
    }

    bool remove(Element element, std::function<void(BinarySearchHelper<BinaryTreeRef> &)> then = {}){
        return self.BinarySearchTree<BinaryTreeRef>::remove(element, [&](auto &helper){
            self.adjust_balance_factor(helper, true);
            if (then) then(helper);
        });
    }
};

template <class LinkedBinaryRef>
void show_tree(LinkedBinaryRef root){
    if (root.is_null()){
        return;
    }
    printf("%d", root.element().value);
    printf(",%d", root.element().balance_factor);
    if (!root.left().is_null() || !root.right().is_null()){
        printf("{");
        show_tree(root.left());
        printf("}");
        printf("{");
        show_tree(root.right());
        printf("}");
    }
}
auto r = the<LinkedBinaryTreeNode>();
auto k = LinkedBinaryTreeRef(r, r);
auto a = AVLTree<LinkedBinaryTreeRef>(k);

auto r2 = the<LinkedBinaryTreeNode>();
auto k2 = LinkedBinaryTreeRef(r2, r2);
auto a2 = BinarySearchTree<LinkedBinaryTreeRef>(k2);

auto r3 = ArrayBinaryTree();
auto k3 = ArrayBinaryTreeRef(r3, 1);
auto a3 = BinarySearchTree<ArrayBinaryTreeRef>(k3);

int state = 1;

WA_EXPORT(demo_change_state) void demo_change_state(int value){
    state = value;
}

WA_EXPORT(demo_clear) void demo_clear(){
    r = the<LinkedBinaryTreeNode>();
    k = LinkedBinaryTreeRef(r, r);
    a = AVLTree<LinkedBinaryTreeRef>(k);

    r2 = the<LinkedBinaryTreeNode>();
    k2 = LinkedBinaryTreeRef(r2, r2);
    a2 = BinarySearchTree<LinkedBinaryTreeRef>(k2);

    r3 = ArrayBinaryTree();
    k3 = ArrayBinaryTreeRef(r3, 1);
    a3 = BinarySearchTree<ArrayBinaryTreeRef>(k3);
}

WA_EXPORT(demo_has) bool demo_has(int value){
    if (state == 1){
        return a.has({value, 0});
    } else if (state == 2){
        return a2.has({value, 0});
    } else if (state == 3){
        return a3.has({value, 0});
    } else {
        printf("invalid state\n");
        return false;
    }
}
WA_EXPORT(demo_insert) void demo_insert(int value){
    if (state == 1){
        a.insert({value, 0});
    } else if (state == 2){
        a2.insert({value, 0});
    } else if (state == 3){
        a3.insert({value, 0});
    } else {
        printf("invalid state\n");
    }
}

WA_EXPORT(demo_remove) bool demo_remove(int value){
    if (state == 1){
        return a.remove({value, 0});
    } else if (state == 2){
        return a2.remove({value, 0});
    } else if (state == 3){
        return a3.remove({value, 0});
    } else {
        printf("invalid state\n");
        return false;
    }
}


WA_EXPORT(demo_iterate) void demo_iterate(){
    printf("In-order iteration: \n");
    if (state == 1){
        a.iterate([](Element e){printf("%d ", e.value);});
    } else if (state == 2){
        a2.iterate([](Element e){printf("%d ", e.value);});
    } else if (state == 3){
        a3.iterate([](Element e){printf("%d ", e.value);});
    } else {
        printf("invalid state\n");
    }
    printf("\n");
}

WA_EXPORT(demo_print) void demo_print(){
    if (state == 1){
        printf("avl@");
        show_tree(k);
    } else if (state == 2){
        printf("tree@");
        show_tree(k2);
    } else if (state == 3){
        printf("tree@");
        show_tree(k3);
        printf("\n");
        printf("Storage vector: \n");
        printf("length = %d\n", r3.storage.size());
        for (int i=0; i<r3.storage.size(); i++){
            if (!r3.storage[i]){
                printf("  x ");
            } else {
                printf("%3d ", r3.storage[i]->value);
            }
        }
    } else {
        printf("\ninvalid state\n");
    }
    printf("\n");
}

int main(){
    printf("working\n");
    //a3.insert({3, 0});
    //show_tree(k3);
    printf("\n");
    
//     for (auto i : {24, 40, 51, 98, 77,
// 53, 32, 30, 25, 69,
// 18, 70, 79, 9, 34,
// 98, 73, 83, 81, 86,
// 44, 83, 25, 22, 33,
// 5, 71, 88, 76, 43,
// 64, 93, 24, 95, 91,
// 66, 62, 19, 82, 61,
// 35, 12, 36, 70, 53,
// 64, 19, 74, 20, 6,
// 37, 40, 39, 93, 88,}){
//         a.remove({i, 0});
//     }
    printf("working\n");
    // a.remove({5, 0});
    // printf("\n");
    // a.iterate([](Element e){printf("%d ", e);});
    // a.remove({6, 0});
    // printf("\n");
    // a.iterate([](Element e){printf("%d ", e);});
    return 0;
}
